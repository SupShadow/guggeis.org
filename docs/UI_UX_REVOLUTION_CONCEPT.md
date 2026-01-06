# UI/UX Revolution Concept: guggeis.org

> Making guggeis.org the most innovative local politician website in Germany

**Version:** 1.0
**Date:** 2026-01-06
**Tech Stack:** Astro 5 + Tailwind 4 + React + Framer Motion

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Hero 2.0](#1-hero-20)
3. [AI Chat Widget](#2-ai-chat-widget)
4. [Wahlprogramm Matcher Quiz](#3-wahlprogramm-matcher-quiz)
5. [Live Social Proof](#4-live-social-proof)
6. [Micro-interactions Library](#5-micro-interactions-library)
7. [Dark Mode](#6-dark-mode)
8. [Mobile Excellence](#7-mobile-excellence)
9. [Color Palette Extension](#color-palette-extension)
10. [Animation Library](#animation-library)
11. [Accessibility Checklist](#accessibility-checklist)
12. [Implementation Priority](#implementation-priority)

---

## Executive Summary

This concept transforms guggeis.org from a solid campaign website into Germany's most innovative local politician digital presence. The key principles:

- **Progressive Enhancement**: Core content works without JS, features layer on top
- **ADHS-optimiert**: Quick wins, clear progress, dopamine triggers
- **Bavaria-authentic**: Not Silicon Valley sleek, but approachable German politics
- **Performance-first**: Every feature must maintain <2s LCP

---

## 1. Hero 2.0

### Current State Analysis

The existing `HeroMotion.tsx` is solid with:
- Parallax scroll effects
- Spring animations
- Countdown component
- Diagonal clip-path design

### Hero 2.0 Enhancements

#### 1.1 Video Background Option

```typescript
// HeroVideo.tsx - New Component Spec

interface HeroVideoProps {
  videoSrc?: string;           // Optional video URL
  posterSrc: string;           // Fallback image (required)
  candidateImageSrc: string;   // Current hero image
  enableVideo?: boolean;       // Feature flag
  reducedMotion?: boolean;     // Auto-detect or override
}

// Behavior:
// - Video loads lazily after LCP
// - Poster shows immediately
// - Video muted, autoplay, loop
// - Pause on scroll out of view (IntersectionObserver)
// - Falls back to image on mobile data saver mode
// - Respects prefers-reduced-motion
```

**Video Specifications:**
- Format: WebM (primary), MP4 (fallback)
- Resolution: 1920x1080, 30fps
- Duration: 8-15 seconds loop
- Compression: <3MB for fast load
- Content: Straubing cityscape, campaign moments, subtle motion

#### 1.2 Typing Animation for Taglines

```typescript
// TypingText.tsx - Component Spec

interface TypingTextProps {
  phrases: string[];           // Array of rotating phrases
  typingSpeed?: number;        // ms per character (default: 80)
  deletingSpeed?: number;      // ms per character (default: 50)
  pauseDuration?: number;      // ms pause between phrases (default: 2000)
  className?: string;
  cursorClassName?: string;
}

// Example usage:
<TypingText
  phrases={[
    "Straubing kann mehr.",
    "Bezahlbar wohnen.",
    "Busse, die fahren.",
    "Mutig nach vorne."
  ]}
  typingSpeed={70}
/>

// Animation states:
// 1. TYPING - Character by character appearance
// 2. PAUSE - Hold complete phrase
// 3. DELETING - Character by character removal
// 4. WAITING - Brief pause before next phrase
```

#### 1.3 Dynamic Countdown Enhancement

```typescript
// CountdownEnhanced.tsx - Component Spec

interface CountdownProps {
  targetDate: Date;
  showMilestones?: boolean;    // Show "100 Tage!", "1 Monat!" etc.
  compactMode?: boolean;       // For mobile/header
  onMilestone?: (days: number, label: string) => void;
}

// Visual enhancements:
// - Flip-clock style animation on number change
// - Pulse animation at milestones (100, 50, 30, 14, 7, 1)
// - Urgency colors: green (>60d), yellow (30-60d), orange (7-30d), red (<7d)
// - Confetti burst at milestones
```

#### 1.4 Hero Layout Variants

```typescript
// HeroVariant type for A/B testing or seasonal changes
type HeroVariant = 'default' | 'video' | 'compact' | 'event-focus';

// default: Current layout with parallax
// video: Video background with text overlay
// compact: Shorter hero for returning visitors
// event-focus: Highlights next event prominently
```

---

## 2. AI Chat Widget

### Design Philosophy

The chat widget must feel like talking to Julian, not a corporate chatbot. It's a "Digital Sprechstunde" - accessible, helpful, but clearly AI-powered (transparency).

### Component Specification

```typescript
// AIChatWidget.tsx

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  initialMessage?: string;
  avatarSrc?: string;
  accentColor?: string;        // Defaults to primary red
  maxHeight?: string;          // Default: '500px'
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

// States:
// 1. COLLAPSED - Floating button with pulse animation
// 2. GREETING - Expanded with welcome message
// 3. ACTIVE - Full conversation view
// 4. MINIMIZED - Small indicator in corner
```

### Visual Design

```
+------------------------------------------+
|  [X]  Frag Julian                    [-] |
|------------------------------------------|
|                                          |
|  [Avatar] Julian (KI-Assistent)          |
|                                          |
|  "Hallo! Ich bin Julians digitaler       |
|   Assistent. Ich kann dir helfen bei:    |
|                                          |
|   - Fragen zum Wahlprogramm              |
|   - Termine und Events                   |
|   - Kontaktaufnahme                      |
|                                          |
|   Was moechtest du wissen?"              |
|                                          |
|------------------------------------------|
| [Quick Replies: "Wohnen" "Termine" ...]  |
|------------------------------------------|
| [_____________ Nachricht... ___] [Send]  |
+------------------------------------------+
```

### Interaction Patterns

```typescript
// Trigger states for widget appearance
const chatTriggers = {
  timeOnPage: 45000,           // Show after 45s on page
  scrollDepth: 0.6,            // Show after 60% scroll
  exitIntent: true,            // Show on exit intent (desktop)
  returnVisitor: true,         // Show immediately for return visitors
  manualOnly: false            // Disable auto-triggers
};

// Quick reply suggestions (context-aware)
const quickReplies = {
  default: [
    "Was steht im Wahlprogramm?",
    "Wann ist die naechste Veranstaltung?",
    "Wie kann ich unterstuetzen?"
  ],
  afterThemes: [
    "Mehr zu Wohnen",
    "Mehr zu Mobilitaet",
    "Wie waehle ich dich?"
  ],
  afterFAQ: [
    "Noch eine Frage",
    "Kontakt aufnehmen",
    "Termin vereinbaren"
  ]
};
```

### Animation Specs

```typescript
// Widget entrance animation
const widgetVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Message bubble animation
const messageVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  }
};

// Typing indicator
const typingIndicatorVariants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 0.2
    }
  }
};
```

### Accessibility Requirements

- Full keyboard navigation
- Focus trap when open
- Escape closes widget
- ARIA live regions for new messages
- Screen reader announces typing state
- High contrast mode support

---

## 3. Wahlprogramm Matcher Quiz

### Concept

A gamified, Tinder-style quiz that matches users with Julian's positions. The user swipes/clicks through statements and sees how much they align.

### Component Specification

```typescript
// WahlprogrammMatcher.tsx

interface QuizQuestion {
  id: string;
  statement: string;
  category: ThemeCategory;
  julianPosition: 'agree' | 'disagree' | 'neutral';
  explanation: string;           // Shown after answer
  programReference?: string;     // Link to program section
}

type ThemeCategory =
  | 'wohnen'
  | 'familie'
  | 'mobilitaet'
  | 'wirtschaft'
  | 'soziales'
  | 'kultur'
  | 'demokratie';

interface QuizState {
  currentIndex: number;
  answers: Map<string, 'agree' | 'disagree' | 'skip'>;
  matchScore: number;           // 0-100
  categoryScores: Map<ThemeCategory, number>;
  isComplete: boolean;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (result: QuizResult) => void;
  enableSharing?: boolean;
  compactMode?: boolean;        // For embedding
}
```

### Visual Design

```
+------------------------------------------+
|           WAHLPROGRAMM-MATCHER           |
|     Finde heraus, wie viel Julian        |
|              in dir steckt               |
|------------------------------------------|
|                                          |
|   [============----] 7/12 Fragen         |
|                                          |
|   +------------------------------------+ |
|   |                                    | |
|   |   "Straubing braucht mehr         | |
|   |    bezahlbare Mietwohnungen."     | |
|   |                                    | |
|   |         [Wohnen]                   | |
|   |                                    | |
|   +------------------------------------+ |
|                                          |
|   [Stimme nicht zu]  [Skip]  [Stimme zu] |
|         (swipe left)       (swipe right) |
|                                          |
+------------------------------------------+
```

### Progress Bar Component

```typescript
// QuizProgress.tsx

interface QuizProgressProps {
  current: number;
  total: number;
  matchScore: number;           // Live score update
  categoryProgress: Map<ThemeCategory, number>;
}

// Visual elements:
// - Main progress bar with fill animation
// - Mini category icons showing completion
// - Live match percentage with count-up animation
// - Milestone celebrations (25%, 50%, 75%)
```

### Results Screen

```typescript
// QuizResults.tsx

interface QuizResultsProps {
  matchScore: number;
  categoryScores: Map<ThemeCategory, number>;
  topMatches: ThemeCategory[];
  lowMatches: ThemeCategory[];
  shareUrl: string;
}

// Result tiers:
// 80-100%: "Politischer Zwilling!"
// 60-79%:  "Starke Uebereinstimmung"
// 40-59%:  "Teilweise einer Meinung"
// 20-39%:  "Verschiedene Perspektiven"
// 0-19%:   "Gegensaetzliche Ansichten"
```

### Sharing Functionality

```typescript
// QuizShare.tsx

interface ShareableResult {
  matchScore: number;
  topCategory: ThemeCategory;
  shareImage: string;           // Generated OG image
  shareText: string;
  shareUrl: string;
}

// Share platforms:
// - WhatsApp (priority for local politics)
// - Instagram Stories (image generation)
// - Twitter/X
// - Facebook
// - Copy link
// - Download as image
```

### Animations

```typescript
// Card swipe animation
const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    rotateZ: direction > 0 ? 10 : -10
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateZ: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    rotateZ: direction > 0 ? 10 : -10,
    transition: { duration: 0.2 }
  })
};

// Score increment animation
const scoreVariants = {
  increment: {
    scale: [1, 1.3, 1],
    color: ["#E3001B", "#00B7A3", "#E3001B"],
    transition: { duration: 0.4 }
  }
};

// Celebration confetti (at milestones)
// Use canvas-confetti or react-confetti
```

---

## 4. Live Social Proof

### Current State

`SupporterCount.astro` has a basic animated counter with avatar group.

### Enhanced Social Proof System

```typescript
// LiveSocialProof.tsx

interface SocialProofProps {
  supporterCount: number;
  recentSupporters?: RecentSupporter[];
  showTicker?: boolean;
  variant?: 'compact' | 'full' | 'ticker-only';
}

interface RecentSupporter {
  name: string;                 // "Michael K."
  location?: string;            // "Straubing-Ost"
  action: SupportAction;
  timestamp: Date;
  avatar?: string;              // Generated or real
}

type SupportAction =
  | 'signed'                    // Newsletter signup
  | 'shared'                    // Social share
  | 'messaged'                  // Contact form
  | 'attended'                  // Event attendance
  | 'quiz-completed';           // Wahlprogramm matcher
```

### Live Ticker Component

```typescript
// SupporterTicker.tsx

interface TickerProps {
  supporters: RecentSupporter[];
  autoScroll?: boolean;
  scrollSpeed?: number;         // px/s
  pauseOnHover?: boolean;
}

// Visual: Horizontal scrolling banner
// "Maria S. aus Straubing-Sued hat gerade geteilt"
// "Thomas M. hat den Wahlprogramm-Matcher gemacht: 87%"
// "Feedback von Anna K. eingeflossen"
```

### Animated Counter Enhancement

```typescript
// AnimatedCounter.tsx

interface AnimatedCounterProps {
  value: number;
  duration?: number;            // Animation duration in ms
  formatNumber?: boolean;       // Add thousands separator
  prefix?: string;              // e.g., "+"
  suffix?: string;              // e.g., " Unterstuetzer"
  onMilestone?: (value: number) => void;
}

// Animation: Odometer-style digit rolling
// Easing: easeOutExpo for satisfying feel
// Milestone celebrations: 100, 250, 500, 1000
```

### Social Proof Placement

```
Page locations for social proof elements:

1. Hero Section (compact counter)
   "127+ Straubinger sind dabei"

2. After Testimonials (full widget)
   [Avatar Stack] + Counter + Recent Activity

3. Floating ticker (optional)
   Bottom of screen, subtle scrolling updates

4. Before CTAs (trust signal)
   "Schon 89 Nachrichten diese Woche"
```

---

## 5. Micro-interactions Library

### Button Interactions

```typescript
// buttonVariants.ts

export const buttonHoverVariants = {
  // Primary button - fill sweep from left
  primary: {
    rest: { backgroundPosition: "100% 0" },
    hover: {
      backgroundPosition: "0% 0",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },

  // Secondary button - border highlight
  secondary: {
    rest: { borderColor: "var(--color-primary)" },
    hover: {
      borderColor: "var(--color-accent-yellow)",
      boxShadow: "0 0 0 2px var(--color-accent-yellow)",
      transition: { duration: 0.2 }
    }
  },

  // Icon button - rotate + scale
  icon: {
    rest: { rotate: 0, scale: 1 },
    hover: { rotate: 15, scale: 1.1 },
    tap: { scale: 0.9 }
  }
};

// Ripple effect on click
export const rippleEffect = {
  initial: { scale: 0, opacity: 0.5 },
  animate: { scale: 4, opacity: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};
```

### Scroll Reveal Animations

```typescript
// scrollRevealVariants.ts

export const scrollReveal = {
  // Fade up (default)
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },

  // Fade in from side
  fadeLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },

  fadeRight: {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },

  // Scale up
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  },

  // Stagger children
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  },

  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }
};
```

### Loading States

```typescript
// loadingVariants.ts

export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const spinnerRotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const dotsLoading = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 0.1
    }
  }
};
```

### Form Field Interactions

```typescript
// formInteractions.ts

export const inputFocus = {
  rest: {
    borderColor: "transparent",
    boxShadow: "none"
  },
  focus: {
    borderColor: "var(--color-primary)",
    boxShadow: "0 0 0 3px rgba(227, 0, 27, 0.15)",
    transition: { duration: 0.2 }
  },
  error: {
    borderColor: "var(--color-error)",
    boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.15)"
  }
};

export const labelFloat = {
  rest: {
    y: 0,
    scale: 1,
    color: "var(--color-gray)"
  },
  active: {
    y: -24,
    scale: 0.85,
    color: "var(--color-primary)",
    transition: { duration: 0.2 }
  }
};
```

### Navigation Interactions

```typescript
// navInteractions.ts

export const menuItemUnderline = {
  rest: { width: 0 },
  hover: {
    width: "100%",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const mobileMenuSlide = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: {
    x: "100%",
    transition: { duration: 0.2 }
  }
};

export const hamburgerToX = {
  top: {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 8 }
  },
  middle: {
    closed: { opacity: 1 },
    open: { opacity: 0 }
  },
  bottom: {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -8 }
  }
};
```

---

## 6. Dark Mode

### Color System Extension

```css
/* Dark mode color tokens */
@theme {
  /* Dark mode variants */
  --color-dark-bg: #121212;
  --color-dark-surface: #1E1E1E;
  --color-dark-surface-elevated: #2D2D2D;
  --color-dark-text-primary: #F5F5F5;
  --color-dark-text-secondary: #A0A0A0;
  --color-dark-border: #3D3D3D;

  /* Adjusted brand colors for dark mode */
  --color-primary-dark: #FF4D5A;      /* Brighter red for visibility */
  --color-secondary-dark: #4DA6FF;    /* Brighter blue */
  --color-accent-teal-dark: #33D9C8;  /* Brighter teal */
  --color-accent-yellow-dark: #FFD54F; /* Slightly muted yellow */
}
```

### Theme Toggle Component

```typescript
// ThemeToggle.tsx

interface ThemeToggleProps {
  position?: 'header' | 'footer' | 'floating';
  showLabel?: boolean;
}

// States: 'light' | 'dark' | 'system'

// Animation: Sun/Moon icon morph
const iconVariants = {
  light: {
    rotate: 0,
    scale: 1,
    pathLength: 1
  },
  dark: {
    rotate: 360,
    scale: 1,
    pathLength: 1,
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};
```

### Dark Mode Implementation

```typescript
// useTheme.ts hook

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check localStorage
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored as any);

    // System preference listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  return { theme, setTheme, resolvedTheme };
}
```

### Component-Level Dark Mode

```css
/* Example: Card component dark mode */
.card {
  background-color: var(--color-white);
  color: var(--color-dark);
  border-color: var(--color-dark) / 10%;
}

:root.dark .card {
  background-color: var(--color-dark-surface);
  color: var(--color-dark-text-primary);
  border-color: var(--color-dark-border);
}

/* Image treatment in dark mode */
:root.dark img {
  filter: brightness(0.9);
}

:root.dark img:hover {
  filter: brightness(1);
}
```

---

## 7. Mobile Excellence

### Bottom Navigation

```typescript
// MobileBottomNav.tsx

interface BottomNavProps {
  items: NavItem[];
  activeItem?: string;
  showLabels?: boolean;
  hapticFeedback?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;              // Notification count
}

const defaultItems: NavItem[] = [
  { id: 'home', label: 'Start', icon: <HomeIcon />, href: '#' },
  { id: 'themen', label: 'Themen', icon: <ListIcon />, href: '#themen' },
  { id: 'quiz', label: 'Quiz', icon: <SparklesIcon />, href: '#quiz' },
  { id: 'kontakt', label: 'Kontakt', icon: <ChatIcon />, href: '#kontakt' }
];
```

### Visual Design

```
+------------------------------------------+
|  [Home]    [Themen]    [Quiz]   [Kontakt] |
|    o          o         (*)        o      |
|  Start     Themen      Quiz     Kontakt   |
+------------------------------------------+
  ^ Fixed at bottom
  ^ Safe area inset respected
  ^ Active item: filled icon + primary color
```

### Gesture Support

```typescript
// useSwipeGesture.ts

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;          // Min distance (default: 50px)
  velocity?: number;           // Min velocity (default: 0.3)
}

// Usage examples:
// - Swipe between quiz cards
// - Swipe to dismiss chat widget
// - Pull-to-refresh for events
// - Swipe carousel for testimonials
```

### Pull-to-Refresh

```typescript
// PullToRefresh.tsx

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;          // Default: 80px
  resistance?: number;         // Default: 2.5
}

// Animation states:
// 1. IDLE - Normal state
// 2. PULLING - User pulling down, indicator grows
// 3. THRESHOLD - Passed threshold, ready to release
// 4. REFRESHING - Spinner animating, fetching data
// 5. COMPLETE - Checkmark, then return to IDLE
```

### Haptic Feedback Concepts

```typescript
// useHaptic.ts

type HapticPattern =
  | 'selection'                // Light tap for selections
  | 'impact-light'             // Button press
  | 'impact-medium'            // Important action
  | 'impact-heavy'             // Major confirmation
  | 'success'                  // Completion feedback
  | 'warning'                  // Attention needed
  | 'error';                   // Something went wrong

function useHaptic() {
  const trigger = (pattern: HapticPattern) => {
    if ('vibrate' in navigator) {
      const patterns: Record<HapticPattern, number[]> = {
        'selection': [10],
        'impact-light': [20],
        'impact-medium': [40],
        'impact-heavy': [60],
        'success': [30, 50, 30],
        'warning': [50, 30, 50],
        'error': [100, 30, 100, 30, 100]
      };
      navigator.vibrate(patterns[pattern]);
    }
  };

  return { trigger };
}
```

### Mobile-Specific Components

```typescript
// MobileContactSheet.tsx
// Bottom sheet for quick contact actions

interface ContactSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Actions:
// - WhatsApp (pre-filled message)
// - Anrufen (tel: link)
// - E-Mail (mailto: link)
// - Termin anfragen (calendar)
```

```typescript
// MobileEventCard.tsx
// Swipeable event card with actions

interface MobileEventCardProps {
  event: Event;
  onSwipeLeft?: () => void;    // Dismiss/skip
  onSwipeRight?: () => void;   // Add to calendar
}
```

### Performance Optimizations

```typescript
// Mobile-specific lazy loading
const ChatWidget = lazy(() => import('./ChatWidget'));
const QuizComponent = lazy(() => import('./WahlprogrammMatcher'));

// Only load on mobile after interaction or scroll
const [loadChat, setLoadChat] = useState(false);
const isMobile = useMediaQuery('(max-width: 1023px)');

useEffect(() => {
  if (isMobile) {
    const timer = setTimeout(() => setLoadChat(true), 5000);
    return () => clearTimeout(timer);
  }
}, [isMobile]);
```

---

## Color Palette Extension

### New Colors Needed

```css
@theme {
  /* Existing colors preserved */
  --color-primary: #E3001B;
  --color-secondary: #005C9E;
  --color-sand: #F6E7D3;
  --color-accent-teal: #00B7A3;
  --color-accent-yellow: #F6B800;
  --color-accent-berry: #8B0034;

  /* NEW: Semantic colors */
  --color-success: #10B981;
  --color-success-light: #D1FAE5;
  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-error: #EF4444;
  --color-error-light: #FEE2E2;
  --color-info: #3B82F6;
  --color-info-light: #DBEAFE;

  /* NEW: Quiz/gamification colors */
  --color-match-high: #10B981;      /* 80-100% match */
  --color-match-medium: #F59E0B;    /* 40-79% match */
  --color-match-low: #EF4444;       /* 0-39% match */

  /* NEW: Dark mode specific */
  --color-dark-bg: #121212;
  --color-dark-surface: #1E1E1E;
  --color-dark-surface-elevated: #2D2D2D;
  --color-dark-border: #3D3D3D;

  /* NEW: Gradient definitions */
  --gradient-hero: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-berry) 100%);
  --gradient-cta: linear-gradient(90deg, var(--color-primary) 0%, #FF4D5A 100%);
  --gradient-success: linear-gradient(135deg, var(--color-success) 0%, var(--color-accent-teal) 100%);

  /* NEW: Overlay colors */
  --color-overlay-light: rgba(246, 231, 211, 0.9);   /* Sand with opacity */
  --color-overlay-dark: rgba(18, 18, 18, 0.9);       /* Dark bg with opacity */

  /* NEW: Focus ring colors */
  --color-focus-primary: rgba(227, 0, 27, 0.35);
  --color-focus-secondary: rgba(0, 92, 158, 0.35);
}
```

---

## Animation Library

### Framer Motion Variants Collection

```typescript
// animations/index.ts

// ===== ENTRANCE ANIMATIONS =====

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

export const slideInFromBottom = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: {
    y: "100%",
    transition: { duration: 0.2 }
  }
};

// ===== CONTAINER ANIMATIONS =====

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// ===== MICRO-INTERACTIONS =====

export const buttonTap = {
  tap: { scale: 0.97 }
};

export const buttonHover = {
  hover: {
    y: -2,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
  }
};

export const cardHover = {
  hover: {
    y: -4,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    transition: { duration: 0.2 }
  }
};

export const linkUnderline = {
  rest: { scaleX: 0, originX: 0 },
  hover: {
    scaleX: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// ===== LOADING ANIMATIONS =====

export const pulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  }
};

export const spin = {
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 0.6, repeat: Infinity }
  }
};

export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
  }
};

// ===== SPECIAL EFFECTS =====

export const confettiBurst = {
  hidden: { scale: 0, rotate: 0, opacity: 0 },
  visible: {
    scale: 1,
    rotate: [0, 180, 360],
    opacity: [0, 1, 0],
    transition: { duration: 1, ease: "easeOut" }
  }
};

export const countUp = (target: number, duration: number = 1.5) => ({
  initial: { count: 0 },
  animate: {
    count: target,
    transition: { duration, ease: "easeOut" }
  }
});

export const progressFill = {
  initial: { width: "0%" },
  animate: (percent: number) => ({
    width: `${percent}%`,
    transition: { duration: 0.8, ease: "easeOut" }
  })
};

// ===== PARALLAX HELPERS =====

export const parallaxSlow = {
  y: (scrollYProgress: any) =>
    scrollYProgress.current * 50
};

export const parallaxFast = {
  y: (scrollYProgress: any) =>
    scrollYProgress.current * 150
};

// ===== EXIT ANIMATIONS =====

export const fadeOut = {
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const slideOutRight = {
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const scaleOut = {
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};
```

---

## Accessibility Checklist

### WCAG 2.1 AA Requirements

#### Perceivable

- [ ] **1.1.1 Non-text Content**: All images have meaningful alt text
- [ ] **1.3.1 Info and Relationships**: Proper heading hierarchy (h1 > h2 > h3)
- [ ] **1.3.2 Meaningful Sequence**: DOM order matches visual order
- [ ] **1.3.4 Orientation**: Content works in portrait and landscape
- [ ] **1.4.1 Use of Color**: Information not conveyed by color alone
- [ ] **1.4.3 Contrast (Minimum)**: 4.5:1 for normal text, 3:1 for large text
- [ ] **1.4.4 Resize Text**: Content readable at 200% zoom
- [ ] **1.4.10 Reflow**: No horizontal scroll at 320px width
- [ ] **1.4.11 Non-text Contrast**: UI components have 3:1 contrast
- [ ] **1.4.12 Text Spacing**: Content works with increased spacing
- [ ] **1.4.13 Content on Hover**: Tooltips dismissible and persistent

#### Operable

- [ ] **2.1.1 Keyboard**: All functionality via keyboard
- [ ] **2.1.2 No Keyboard Trap**: Focus can move away from all elements
- [ ] **2.1.4 Character Key Shortcuts**: No single-key shortcuts (or can be disabled)
- [ ] **2.2.1 Timing Adjustable**: Countdown has pause/extend option
- [ ] **2.3.1 Three Flashes**: No content flashes more than 3x/second
- [ ] **2.4.1 Bypass Blocks**: Skip link to main content
- [ ] **2.4.2 Page Titled**: Descriptive page titles
- [ ] **2.4.3 Focus Order**: Logical tab order
- [ ] **2.4.4 Link Purpose**: Links have descriptive text
- [ ] **2.4.6 Headings and Labels**: Descriptive headings
- [ ] **2.4.7 Focus Visible**: Clear focus indicators (3px outline)
- [ ] **2.5.1 Pointer Gestures**: Single pointer alternatives for swipes
- [ ] **2.5.2 Pointer Cancellation**: Actions on up-event, can be aborted
- [ ] **2.5.3 Label in Name**: Visible labels match accessible names
- [ ] **2.5.4 Motion Actuation**: Motion inputs have alternatives

#### Understandable

- [ ] **3.1.1 Language of Page**: `lang="de"` on html element
- [ ] **3.2.1 On Focus**: No context change on focus
- [ ] **3.2.2 On Input**: No unexpected context change on input
- [ ] **3.3.1 Error Identification**: Errors clearly identified
- [ ] **3.3.2 Labels or Instructions**: Form fields have labels
- [ ] **3.3.3 Error Suggestion**: Helpful error messages
- [ ] **3.3.4 Error Prevention**: Confirmation for important actions

#### Robust

- [ ] **4.1.1 Parsing**: Valid HTML
- [ ] **4.1.2 Name, Role, Value**: ARIA attributes correct
- [ ] **4.1.3 Status Messages**: Live regions for dynamic content

### Component-Specific Requirements

#### Chat Widget

- [ ] Keyboard navigable
- [ ] Focus trap when open
- [ ] Escape closes widget
- [ ] ARIA live region for new messages
- [ ] Screen reader announces "X typing..."
- [ ] High contrast support
- [ ] Reduced motion alternative

#### Quiz Component

- [ ] Keyboard-only completion possible
- [ ] Touch alternatives for swipe gestures
- [ ] Progress announced to screen readers
- [ ] Results exportable as text
- [ ] No time pressure

#### Video Background

- [ ] Pause button accessible
- [ ] Respects prefers-reduced-motion
- [ ] Important content not only in video
- [ ] Alternative image always loads first

#### Bottom Navigation

- [ ] Touch targets >= 44x44px
- [ ] Active state announced
- [ ] Works with screen magnification
- [ ] Labels visible (not icon-only)

### Testing Protocol

1. **Automated Testing**
   - axe DevTools browser extension
   - Lighthouse accessibility audit
   - Pa11y CLI in CI pipeline

2. **Manual Testing**
   - Keyboard-only navigation test
   - Screen reader test (VoiceOver, NVDA)
   - 200% zoom test
   - High contrast mode test
   - Reduced motion test

3. **User Testing**
   - Test with actual users with disabilities
   - Include in beta testing group

---

## Implementation Priority

### Phase 1: Foundation (Week 1-2)

1. **Dark Mode Infrastructure**
   - Theme toggle component
   - CSS custom properties for dark mode
   - localStorage persistence

2. **Animation Library**
   - Create animation variants file
   - Update existing components with new animations
   - Add reduced motion support

3. **Micro-interactions**
   - Button hover effects
   - Form field interactions
   - Loading states

### Phase 2: Hero & Social Proof (Week 3-4)

4. **Hero 2.0**
   - Typing animation component
   - Enhanced countdown
   - Video background option (lazy loaded)

5. **Live Social Proof**
   - Enhanced counter animation
   - Supporter ticker
   - Real-time updates infrastructure

### Phase 3: Mobile Excellence (Week 5-6)

6. **Bottom Navigation**
   - Fixed bottom nav component
   - Gesture support library
   - Pull-to-refresh

7. **Mobile Optimizations**
   - Contact sheet
   - Performance optimizations
   - Haptic feedback (where supported)

### Phase 4: Major Features (Week 7-10)

8. **AI Chat Widget**
   - Widget UI
   - Chat logic integration
   - Quick replies
   - Analytics tracking

9. **Wahlprogramm Matcher Quiz**
   - Question cards
   - Swipe/click interactions
   - Results screen
   - Social sharing

### Phase 5: Polish & A11y (Week 11-12)

10. **Accessibility Audit**
    - Full WCAG 2.1 AA review
    - Screen reader testing
    - Keyboard navigation fixes

11. **Performance Optimization**
    - Bundle size audit
    - Core Web Vitals optimization
    - Lazy loading refinement

12. **A/B Testing Setup**
    - Hero variants
    - CTA placements
    - Widget triggers

---

## Appendix: File Structure

```
src/
├── components/
│   ├── animations/
│   │   ├── variants.ts           # Framer Motion variants
│   │   └── useAnimation.ts       # Custom animation hooks
│   ├── chat/
│   │   ├── ChatWidget.tsx
│   │   ├── ChatMessage.tsx
│   │   └── QuickReplies.tsx
│   ├── hero/
│   │   ├── HeroMotion.tsx        # Existing
│   │   ├── HeroVideo.tsx         # NEW
│   │   ├── TypingText.tsx        # NEW
│   │   └── CountdownEnhanced.tsx # NEW
│   ├── quiz/
│   │   ├── WahlprogrammMatcher.tsx
│   │   ├── QuizCard.tsx
│   │   ├── QuizProgress.tsx
│   │   ├── QuizResults.tsx
│   │   └── QuizShare.tsx
│   ├── social-proof/
│   │   ├── SupporterCount.astro  # Existing
│   │   ├── SupporterTicker.tsx   # NEW
│   │   └── AnimatedCounter.tsx   # NEW
│   ├── mobile/
│   │   ├── BottomNav.tsx
│   │   ├── ContactSheet.tsx
│   │   └── PullToRefresh.tsx
│   └── ui/
│       ├── Button.astro          # Existing
│       ├── ThemeToggle.tsx       # NEW
│       └── LoadingStates.tsx     # NEW
├── hooks/
│   ├── useTheme.ts
│   ├── useSwipeGesture.ts
│   ├── useHaptic.ts
│   └── useReducedMotion.ts
├── styles/
│   ├── global.css                # Existing
│   ├── dark-mode.css             # NEW
│   └── animations.css            # NEW
└── lib/
    └── quiz-questions.ts         # Quiz content
```

---

*Document created: 2026-01-06*
*Author: OMEGA for Julian Guggeis*
*Status: Concept Phase - Ready for Review*
