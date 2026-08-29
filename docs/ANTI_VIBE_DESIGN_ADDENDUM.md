# NOVA Core — Anti-Vibe Design Addendum

Design principles to avoid the "vibe-coded" aesthetic and build a **Pro Tool** that feels reliable, fast, and engineered—not like a 5-second social clip.

---

## 1. Colors & Visuals

### Avoid
- Pure `#000000` backgrounds
- Neon purple gradients
- "Magic" sparkles and glow effects
- Low-contrast "atmospheric" text

### Apply
| Principle | Implementation |
|-----------|----------------|
| **Off-blacks** | Use dark navy `#0D1B2A` or deep forest `#0F1E0F` for backgrounds—creates proprietary atmosphere, not generic dark mode |
| **Tactile textures** | Subtle grain (2–4% opacity) or paper texture overlays—signals hand-crafted design |
| **WCAG AAA** | Minimum 7:1 contrast for body text, 4.5:1 for large text. Test in bright sunlight. |
| **High-contrast utility** | Readable in direct sun > "cool" low-contrast |

---

## 2. Typography

### Avoid
- Inter, Geist, SF Pro exclusively
- 120px headings + 12px body
- No optical sizing considerations

### Apply
| Principle | Implementation |
|-----------|----------------|
| **Type pairing** | **Serif** for headings (authority, reliability) + **Sans-serif** for UI (legibility). e.g., Source Serif 4 + Source Sans 3, or Crimson Pro + Work Sans |
| **Vertical rhythm** | 8px baseline grid. All line-heights and spacing snap to multiples of 8 |
| **Optical sizing** | Prefer fonts with Display and Text cuts. Use `optical-sizing: auto` where supported |
| **Proportional scale** | Heading sizes: 32, 24, 20, 18. Body: 16. Caption: 14. Never go below 14px for UI text |

---

## 3. Layout & Components

### Avoid
- Bento box (random rounded rectangles)
- 40px border radii
- Excessive whitespace hiding lack of content

### Apply
| Principle | Implementation |
|-----------|----------------|
| **Editorial grids** | Asymmetric layouts, sidebars, varied column widths. Magazine-like hierarchy |
| **Intentional density** | Show real data—workout logs, stats, progress. The app should *do* something, not look empty |
| **Hard edges** | 0px or 4px border radius. "Pro Tool" not "Consumer Toy" |
| **Information density** | Clear, well-organized data. Power users over casual scrollers |

---

## 4. Animations & Interactions

### Avoid
- Entrance animations (fade-in, slide-up on scroll)
- Glowing hover effects
- "Vibe" animations that add nothing

### Apply
| Principle | Implementation |
|-----------|----------------|
| **Immediate feedback** | Tab indicator slides, button depresses 1px on press. Functional micro-interactions |
| **Stateful transitions** | Deleting an item → remaining items animate to fill the gap. "UX Animation" not "Vibe Animation" |
| **Predictable motion** | 150–200ms for micro-interactions. No surprises |

---

## 5. UX Behaviors

### Avoid
- Empty skeleton screens that stay empty
- "Magic AI" buttons with no explanation

### Apply
| Principle | Implementation |
|-----------|----------------|
| **Predictive loading** | Prefetch on hover/link focus. Instant feel without spinners |
| **Contextual help** | Info tooltips, Cmd+K command palette for power users |
| **Offline support** | Cached state, works when connection drops. Hallmark of a real app |
| **Explain AI output** | "Scan detected Squat—here's why" not "AI says so" |

---

## 6. Copywriting & Content

### Avoid
- "Revolutionizing the workflow of tomorrow"
- Generic AI-generated stock
- "Submit" / "Error"

### Apply
| Principle | Implementation |
|-----------|----------------|
| **Micro-copy with personality** | "Send my report" not "Submit". "We couldn't find that workout; try checking the name" not "Error" |
| **Proof of work** | Real case studies, video demos, raw screenshots—no beautified mockups |
| **Data-driven headlines** | "Track 50+ exercises with real-time form feedback" not "Build your dreams" |
| **Action-oriented CTAs** | "Start scan" / "Log workout" / "View progress" |

---

## Core Principle

> **Design for The Power User, not The Casual Scroller.**

Vibe-coding looks good in a 5-second clip. Product design is used for 8 hours a day.  
If NOVA Core feels like a **tool** (reliable, fast, predictable) rather than an **advertisement**, we have avoided the vibe-coded trap.
