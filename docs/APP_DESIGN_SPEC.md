# NOVA Core — App Design Specification

A visual and UX blueprint for how the app will look and feel across all screens.

---

## 1. Design Foundation

### 1.1 Color Palette (Anti-Vibe: off-blacks, WCAG AAA)
| Role | Hex | Use |
|------|-----|-----|
| **Background** | `#0D1B2A` | Dark navy — proprietary (not #000) |
| **Background Forest** | `#0F1E0F` | Deep forest — wellness screens |
| **Surface** | `#151F2E` | Cards, modals |
| **Primary Green** | `#43A047` | Primary actions, progress |
| **Primary Blue** | `#1976D2` | Trust, hydration |
| **Text Primary** | `#FFFFFF` | Headings, body (14:1 contrast) |
| **Text Secondary** | `#B8C5D6` | Subtitles (WCAG AAA) |
| **Text Muted** | `#8B9AAD` | Captions only |

### 1.2 Typography (Serif + Sans pairing)
- **Headings:** Serif (Georgia), Bold, 24–32px, 8px baseline grid
- **Body:** Sans-serif, Regular, 16px, line-height 24px
- **Captions:** 14px minimum — never below 14px for UI
- **Buttons:** Semibold, 16px

### 1.3 Layout Principles (Pro Tool aesthetic)
- **Hard edges:** 0px or 4px border radius — not bubbly
- **8px baseline grid:** All spacing snaps to multiples of 8
- **Information density:** Show real data; avoid empty layouts
- **WCAG AAA:** 7:1 body, 4.5:1 large text — readable in sunlight

### 1.4 Anti-Vibe Addendum
See `docs/ANTI_VIBE_DESIGN_ADDENDUM.md` for full principles.

### 1.5 Implementation (Theme Files)
- **Colors:** `src/theme/colors.ts` — import for StyleSheet / programmatic use
- **Typography:** `src/theme/typography.ts` — font sizes, weights, presets
- **Tailwind:** `tailwind.config.js` — use classes: `bg-primary-green`, `text-nova-text-secondary`, `rounded-nova`, `text-2xl`, `font-semibold`

---

## 2. Navigation Structure

```
┌─────────────────────────────────────────────────────────┐
│                    TAB BAR (Bottom)                      │
│  [ Home ]  [ Workout ]  [ Progress ]  [ Nutrition ]  [Profile] │
└─────────────────────────────────────────────────────────┘
```

- **5 tabs** — Home, Workout, Progress, Nutrition, Profile
- **Tab bar:** Dark surface (`#1E1E1E`), icons + labels, active tab in primary green
- **Floating scan button:** Center tab for Workout is a prominent circular scan CTA (slightly elevated)

---

## 3. Screen-by-Screen Layouts

### 3.1 Home Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  ☰  NOVA Core                    🔔  👤                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Good morning, [Name]                                   │
│  [Cycle phase badge if applicable]                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ACTIVITY RINGS (3 concentric circles)           │   │
│  │  Workouts │ Hydration │ Steps                    │   │
│  │  ○○○ 2/5  │  ○○○ 4/8   │  ○○○ 3.2k/10k           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────┐ ┌───────────────────────┐ │
│  │  🔥 12 Day Streak       │ │  Today's Suggestion    │ │
│  │  Keep it up!            │ │  Light yoga – luteal   │ │
│  └─────────────────────────┘ └───────────────────────┘ │
│                                                         │
│  QUICK START                                             │
│  ┌─────────────────┐ ┌─────────────────┐               │
│  │  📷 Scan Workout │ │  📋 Start Plan  │               │
│  │  AI-guided form  │ │  Suggested      │               │
│  └─────────────────┘ └─────────────────┘               │
│                                                         │
│  RECENT ACTIVITY                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Yesterday · Full body · 32 min                  │   │
│  │  Tue · Yoga flow · 20 min                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
│  [ Home ]  [ ⊕ Scan ]  [ Progress ]  [ Nutrition ] [Me] │
└─────────────────────────────────────────────────────────┘
```

**Key elements:**
- Greeting with optional cycle badge (e.g., "Follicular · High energy")
- Activity rings: workouts, hydration, steps (green/blue/orange)
- Streak card with flame icon
- "Today's suggestion" card (AI recommendation based on cycle/goals)
- Two CTA cards: Scan Workout, Start Plan
- Recent activity list (last 3–5 sessions)

---

### 3.2 Workout / Scan Screen

```
┌─────────────────────────────────────────────────────────┐
│  ← Back              SCAN WORKOUT                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │            CAMERA VIEW (full width)              │   │
│  │                                                 │   │
│  │     ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐             │   │
│  │     │  POSE OVERLAY (skeleton)    │             │   │
│  │     │  Joints connected by lines  │             │   │
│  │     └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘             │   │
│  │                                                 │   │
│  │  "Squat" detected · Rep 3                        │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  💬 "Keep your back straight"                    │   │
│  │     (Form feedback banner – green/orange/red)    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Reps: 3  ·  Sets: 1/3  ·  Rest: 60s                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         ●  RECORD  (large circular button)       │   │
│  │              Tap to start / pause                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key elements:**
- Full-screen camera with skeleton overlay
- Live exercise label + rep count
- Form feedback strip below camera (color-coded by severity)
- Rep/set/rest display
- Large record button (pulsing when active)
- Optional: mini exercise thumbnail in corner

---

### 3.3 Workout Library (pre-scan or browse)

```
┌─────────────────────────────────────────────────────────┐
│  ← Back              WORKOUT LIBRARY                    │
├─────────────────────────────────────────────────────────┤
│  [ All ] [ Strength ] [ Cardio ] [ Yoga ] [ Core ]      │
│  ────────────────────────────────────────────────      │
│                                                         │
│  STRENGTH                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │  [img]       │ │  [img]       │ │  [img]       │    │
│  │  Squats      │ │  Push-ups    │ │  Deadlifts   │    │
│  │  Beginner    │ │  Beginner    │ │  Intermed.   │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                         │
│  CORE                                                    │
│  ┌──────────────┐ ┌──────────────┐                      │
│  │  [img]       │ │  [img]       │                      │
│  │  Plank       │ │  Bird Dog    │                      │
│  └──────────────┘ └──────────────┘                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key elements:**
- Category chips (horizontal scroll)
- Grid of exercise cards: thumbnail, name, difficulty
- Tap card → exercise detail (instructions, form cues, "Start" or "Scan")

---

### 3.4 Exercise Detail (from library or post-scan)

```
┌─────────────────────────────────────────────────────────┐
│  ← Back                    ⋮                            │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │           [Video or animated demo]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Squat                          Strength · Beginner     │
│                                                         │
│  Muscles: Quads, Glutes, Hamstrings, Core               │
│                                                         │
│  HOW TO PERFORM                                          │
│  1. Feet shoulder-width, toes slightly out               │
│  2. Lower hips back and down...                          │
│                                                         │
│  COMMON MISTAKES                                         │
│  • Rounding back → Keep chest up                         │
│  • Knees caving → Push knees out                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         START WORKOUT  (primary button)          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.5 Progress Tracker

```
┌─────────────────────────────────────────────────────────┐
│  ☰  Progress                        📅 This week        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  WORKOUTS THIS WEEK                              │   │
│  │  ████████░░ 4/5 days                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Line/bar chart: workouts over time]            │   │
│  │  Mon Tue Wed Thu Fri Sat Sun                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ACHIEVEMENTS                                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │  🏆    │ │  🔥    │ │  💪    │ │  📈    │           │
│  │ First  │ │ 7-day  │ │ 50     │ │ New PB │           │
│  │ Workout│ │ streak │ │ reps   │ │        │           │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                         │
│  PERSONAL BESTS                                          │
│  • Push-ups: 15  ·  Plank: 1:20  ·  Squats: 20          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.6 Nutrition & Hydration

```
┌─────────────────────────────────────────────────────────┐
│  ☰  Nutrition                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HYDRATION TODAY                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ○○○○○○○○  4/8 glasses                           │   │
│  │  [ + Add ]                                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  TODAY'S MEALS                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Breakfast · 420 cal    [Edit]                   │   │
│  │  Lunch · 580 cal        [Edit]                   │   │
│  │  Dinner · —             [Add]                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  MACROS  P: 65g  C: 180g  F: 55g  (progress bars)       │
│                                                         │
│  [ View Meal Plan ]  [ Shopping List ]                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.7 Menstrual Cycle Tracker (in Profile or standalone)

```
┌─────────────────────────────────────────────────────────┐
│  ← Back              CYCLE TRACKER                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Calendar grid - current month]                 │   │
│  │  Cycle days highlighted, predicted phases        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Current phase: Luteal · Day 22                         │
│  Suggested: Moderate intensity, magnesium-rich foods    │
│                                                         │
│  SYMPTOMS (multi-select chips)                           │
│  [ Cramps ] [ Fatigue ] [ Mood ] [ Bloat ] [ None ]     │
│                                                         │
│  AI WORKOUT SUGGESTIONS                                  │
│  • Gentle yoga, walking, light strength                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 3.8 Profile & Settings

```
┌─────────────────────────────────────────────────────────┐
│  ☰  Profile                                             │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Avatar]  [Name]                                │   │
│  │            Member since Mar 2025                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  GOALS & PREFERENCES                                     │
│  • Fitness goal        → Muscle gain                    │
│  • Experience level    → Beginner                       │
│  • Cycle tracking      → On                             │
│                                                         │
│  CONNECTIONS                                             │
│  • Health Connect / Apple Health                        │
│  • Google Account                                       │
│                                                         │
│  NOTIFICATIONS  ·  REMINDERS  ·  PRIVACY                 │
│                                                         │
│  [ Sign out ]                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Onboarding Flow (first-time users)

```
Screen 1: Welcome + value prop
  "Your AI fitness coach" + hero illustration
  [ Get Started ]

Screen 2: Goal selection
  "What's your main goal?" 
  [ Muscle gain ] [ Fat loss ] [ Energy ] [ General health ]
  [ Continue ]

Screen 3: Experience level
  [ Beginner ] [ Intermediate ] [ Advanced ]
  [ Continue ]

Screen 4: Schedule & preferences
  Days per week, workout length, cycle tracking (opt-in)
  [ Continue ]

Screen 5: Health data permissions
  "Connect Health Connect / Apple Health for best experience"
  [ Connect ] [ Skip ]

Screen 6: Camera permission
  "NOVA uses your camera to analyze form. All processing stays on device."
  [ Grant access ]

Screen 7: Ready
  "You're all set, [Name]!"
  [ Go to Home ]
```

---

## 5. Key User Flows

| Flow | Steps |
|------|-------|
| **Scan workout** | Home → Tap Scan → Camera → (AI detects) → Form feedback + rep count → End session → Log |
| **Start planned workout** | Home → Start Plan → Exercise list → Tap exercise → Detail → Start → Camera or timer |
| **Log hydration** | Nutrition tab → Tap + on water tracker → Logged |
| **Track cycle** | Profile → Cycle Tracker → Log symptoms / dates → AI suggestions update |
| **View progress** | Progress tab → Charts, badges, personal bests |

---

## 6. Component Summary

| Component | Description |
|-----------|-------------|
| **Activity rings** | 3 concentric circles, fill by progress |
| **Streak card** | Flame icon + days + short message |
| **Exercise card** | Thumbnail, title, difficulty, category |
| **Form feedback banner** | One-line cue, color by severity |
| **Pose overlay** | Skeleton on camera feed |
| **Record button** | Large circle, pulse when active |
| **Tab bar** | 5 tabs, center = prominent scan CTA |
| **Cycle badge** | Small pill: phase name + optional icon |

---

## 7. Responsive & Accessibility Notes

- **Safe areas:** Padding for notch, status bar, home indicator
- **Touch targets:** Minimum 44×44pt
- **Contrast:** WCAG AA for text
- **Font scaling:** Support system font size
- **VoiceOver:** Labels on all interactive elements
- **High-contrast mode:** Optional theme for accessibility

---

*Next step: Implement screens and navigation based on this spec.*
