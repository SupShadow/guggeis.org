# 🗳️ guggeis.org

**Wahlkampf-Website für Julian Guggeis — SPD OB-Kandidat Straubing 2026**

[![Deploy](https://github.com/SupShadow/guggeis.org/actions/workflows/deploy.yml/badge.svg)](https://github.com/SupShadow/guggeis.org/actions)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fguggeis.org)](https://guggeis.org)

---

## 🎯 Mutig für Straubing

> *„Straubing kann mehr."*

One-Pager im Corporate Design der Kampagne. Modern, responsiv, barrierefrei.

**Live:** [guggeis.org](https://guggeis.org)

---

## ⚡ Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| Framework | [Astro 5](https://astro.build) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Fonts | Archivo Black + Inter |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## 🎨 Corporate Design

```
Mutig-Rot     #E3000F  — Primärfarbe, CTAs
Donaublau     #005B99  — Sekundär, Termine
Gäubodensand  #F5F1E8  — Hintergründe
Akzent-Gelb   #FFD700  — Highlights
```

---

## 📁 Projektstruktur

```
src/
├── components/
│   ├── Header.astro       # Navigation
│   ├── Hero.astro         # Hero + Countdown
│   ├── Manifest.astro     # Vision Statement
│   ├── AboutMe.astro      # Über Julian
│   ├── Topics.astro       # Top-5 Garantien + Themen
│   ├── Testimonials.astro # Unterstützer-Stimmen
│   ├── Events.astro       # Termine (API-basiert)
│   ├── Contact.astro      # Kontaktformular
│   ├── JoinUs.astro       # Mitmachen CTA
│   ├── Newsletter.astro   # Newsletter-Anmeldung
│   ├── ShareButtons.astro # Social Sharing
│   └── Footer.astro       # Footer + Legal
├── layouts/
│   └── Layout.astro       # Base Layout + SEO
├── pages/
│   ├── index.astro        # Hauptseite
│   ├── impressum.astro    # Impressum
│   └── datenschutz.astro  # Datenschutz
└── styles/
    └── global.css         # Tailwind + Custom CSS
```

---

## 🚀 Entwicklung

```bash
# Dependencies installieren
npm install

# Dev-Server starten (http://localhost:4321)
npm run dev

# Production Build
npm run build

# Build Preview
npm run preview
```

---

## 🔧 Konfiguration

### Kontaktformular (Formspree)

In `src/components/Contact.astro`:
```javascript
const formspreeId = "YOUR_FORM_ID"; // Von formspree.io
```

### Termine-API

Events werden geladen von:
```
https://supshadow.github.io/spd-straubing-kampagne-termine/api/termine.json
```

Format:
```json
{
  "termine": [{
    "datum": "2026-01-15",
    "uhrzeit": "19:00",
    "titel": "Bürgerversammlung",
    "ort": "Rathaus Straubing",
    "beschreibung": "Offene Diskussion"
  }]
}
```

---

## ♿ Barrierefreiheit

- WCAG 2.1 AA konform
- Skip-Link zur Navigation
- Fokus-Management im Mobile-Menü
- Reduzierte Bewegung unterstützt
- Semantisches HTML + ARIA Labels

---

## 📱 Features

- [x] Responsive Design (Mobile-first)
- [x] Live-Countdown zur Kommunalwahl
- [x] Social Share Buttons (WhatsApp, Facebook, X)
- [x] Open Graph + Twitter Cards
- [x] Schema.org strukturierte Daten
- [x] Externe Termine-API
- [x] Sitemap + SEO optimiert
- [ ] Newsletter-Integration
- [ ] Wahlprogramm PDF

---

## 📄 Deployment

Automatisch via GitHub Actions bei Push auf `main`:

1. Build mit Astro
2. Deploy auf GitHub Pages
3. Custom Domain: guggeis.org

---

## 📜 Lizenz

© 2024-2026 Julian Guggeis / SPD Straubing

---

<p align="center">
  <strong>Mutig für Straubing.</strong><br>
  <sub>Kommunalwahl Bayern • 14. März 2026</sub>
</p>
