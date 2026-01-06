/**
 * Cloudflare Worker: Chat API for guggeis.org
 *
 * Proxies chat requests to Claude API (Haiku) with Julian Guggeis personality.
 *
 * Environment Variables Required:
 * - ANTHROPIC_API_KEY: Your Anthropic API key (set via `wrangler secret put ANTHROPIC_API_KEY`)
 *
 * KV Namespace Required:
 * - RATE_LIMIT_KV: For rate limiting (create via `wrangler kv:namespace create RATE_LIMIT_KV`)
 */

export interface Env {
  ANTHROPIC_API_KEY: string;
  RATE_LIMIT_KV: KVNamespace;
  ALLOWED_ORIGIN: string;
  RATE_LIMIT_REQUESTS: string;
  RATE_LIMIT_WINDOW_MINUTES: string;
  ENVIRONMENT: string;
}

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  reply: string;
}

interface ErrorResponse {
  error: string;
  code: string;
}

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  stop_reason: string;
}

// System prompt embedding Julian's personality and key facts
const SYSTEM_PROMPT = `Du bist Julian Guggeis - ein digitaler Assistent, der Fragen zu Julian und seiner Kandidatur beantwortet.

WICHTIGE FAKTEN:
- Julian Guggeis, 31 Jahre, gebürtiger Straubinger
- Stadtrats-Kandidat SPD Straubing, Listenplatz 11
- NICHT OB-Kandidat! Das ist Peter Stranninger
- IT-Unternehmer seit 2018, ehemaliger Heilerziehungspfleger
- Stellvertretender Vorsitzender SPD Straubing
- Kommunalwahl: 8. März 2026

TOP-5 THEMEN:
1. Bezahlbar wohnen (30% Sozialquote, Teisnacher Modell)
2. Familien entlasten (Straubing-Zulage, mehr Kitaplätze)
3. Besser ankommen (ÖPNV, Unterführung Otto-von-Dandl-Ring)
4. Innenstadt beleben (Donaustrand, Pop-up-Stores)
5. Sicher fühlen (Kümmerer vor Ort)

WAHLINFO:
- Du hast 40 Stimmen bei der Stadtratswahl
- Du kannst Julian bis zu 3 Stimmen geben (kumulieren)
- Du kannst Kandidaten verschiedener Parteien wählen (panaschieren)
- Merksatz: Julian Guggeis - SPD Platz 11 - bis zu 3 Stimmen!

KONTAKT:
- Email: info@guggeis-it.de
- Telefon: 0151 46523225
- Instagram: @jguggeis
- Website: guggeis.org

KOMMUNIKATIONSREGELN:
- Verwende immer "Du"-Form, freundlich und direkt
- Leichter niederbayerischer Einschlag erlaubt
- Halte Antworten KURZ: maximal 2-3 Sätze
- Bei komplexen Themen: verweise auf guggeis.org
- Bei OB-Fragen: Erkläre dass Peter Stranninger OB-Kandidat ist, Julian kandidiert für den Stadtrat
- Bei Bundes-/Landespolitik: Fokus auf Kommunalpolitik lenken
- NIEMALS: Andere Kandidaten beleidigen, Wahlversprechen machen, persönliche Daten nennen

BEISPIEL-ANTWORTEN:
- "Hey, gute Frage!"
- "Das ist mir wichtig, weil..."
- "Schau, das Thema kenn ich aus eigener Erfahrung..."
- "Ehrlich gesagt..."

WICHTIG: Du antwortest ALS Julian (ich-Form), nicht ÜBER Julian.`;

// CORS headers
function getCorsHeaders(origin: string, allowedOrigin: string): HeadersInit {
  const isAllowed = origin === allowedOrigin ||
                    origin === "http://localhost:4321" ||
                    origin === "http://localhost:3000" ||
                    origin.endsWith(".guggeis.org");

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

// Rate limiting
async function checkRateLimit(
  kv: KVNamespace,
  ip: string,
  maxRequests: number,
  windowMinutes: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `rate:${ip}`;
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  const data = await kv.get<{ count: number; windowStart: number }>(key, "json");

  if (!data || now - data.windowStart > windowMs) {
    // New window
    await kv.put(key, JSON.stringify({ count: 1, windowStart: now }), {
      expirationTtl: windowMinutes * 60,
    });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (data.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: data.windowStart + windowMs
    };
  }

  // Increment counter
  await kv.put(key, JSON.stringify({ count: data.count + 1, windowStart: data.windowStart }), {
    expirationTtl: windowMinutes * 60,
  });

  return {
    allowed: true,
    remaining: maxRequests - data.count - 1,
    resetAt: data.windowStart + windowMs
  };
}

// Call Claude API
async function callClaude(
  apiKey: string,
  message: string
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: message,
        },
      ] as AnthropicMessage[],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Claude API error:", response.status, errorText);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = (await response.json()) as AnthropicResponse;

  if (!data.content || data.content.length === 0) {
    throw new Error("Empty response from Claude");
  }

  return data.content[0].text;
}

// Validate request body
function validateRequest(body: unknown): body is ChatRequest {
  if (!body || typeof body !== "object") return false;
  const req = body as Record<string, unknown>;
  if (typeof req.message !== "string") return false;
  if (req.message.length === 0 || req.message.length > 1000) return false;
  return true;
}

// JSON response helper
function jsonResponse(
  data: ChatResponse | ErrorResponse,
  status: number,
  headers: HeadersInit
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const corsHeaders = getCorsHeaders(origin, env.ALLOWED_ORIGIN);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only POST to /api/chat
    if (request.method !== "POST" || url.pathname !== "/api/chat") {
      return jsonResponse(
        { error: "Not found", code: "NOT_FOUND" },
        404,
        corsHeaders
      );
    }

    // Get client IP for rate limiting
    const clientIP = request.headers.get("CF-Connecting-IP") ||
                     request.headers.get("X-Forwarded-For")?.split(",")[0] ||
                     "unknown";

    // Check rate limit
    const maxRequests = parseInt(env.RATE_LIMIT_REQUESTS) || 100;
    const windowMinutes = parseInt(env.RATE_LIMIT_WINDOW_MINUTES) || 1;

    const rateLimit = await checkRateLimit(
      env.RATE_LIMIT_KV,
      clientIP,
      maxRequests,
      windowMinutes
    );

    const rateLimitHeaders = {
      ...corsHeaders,
      "X-RateLimit-Limit": maxRequests.toString(),
      "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      "X-RateLimit-Reset": Math.ceil(rateLimit.resetAt / 1000).toString(),
    };

    if (!rateLimit.allowed) {
      return jsonResponse(
        { error: "Zu viele Anfragen. Bitte warte kurz.", code: "RATE_LIMITED" },
        429,
        rateLimitHeaders
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        { error: "Ungueltige Anfrage", code: "INVALID_JSON" },
        400,
        rateLimitHeaders
      );
    }

    // Validate request
    if (!validateRequest(body)) {
      return jsonResponse(
        { error: "Nachricht fehlt oder ist zu lang (max 1000 Zeichen)", code: "INVALID_MESSAGE" },
        400,
        rateLimitHeaders
      );
    }

    // Check API key
    if (!env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY not configured");
      return jsonResponse(
        { error: "Server-Konfigurationsfehler", code: "CONFIG_ERROR" },
        500,
        rateLimitHeaders
      );
    }

    // Call Claude API
    try {
      const reply = await callClaude(env.ANTHROPIC_API_KEY, body.message);
      return jsonResponse({ reply }, 200, rateLimitHeaders);
    } catch (error) {
      console.error("Claude API call failed:", error);
      return jsonResponse(
        {
          error: "Sorry, da ist etwas schiefgelaufen. Probier es nochmal oder schreib mir direkt an info@guggeis-it.de",
          code: "API_ERROR"
        },
        500,
        rateLimitHeaders
      );
    }
  },
};
