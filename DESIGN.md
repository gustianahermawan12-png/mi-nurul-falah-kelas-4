# Design Brief

## Direction

**Emerald Madrasah** — a serene, mobile-first Islamic school companion with a deep emerald summary card and cream content surfaces.

## Tone

Calm, trustworthy, modern Islamic — clean data density without corporate coldness; green is devotional, gold is reverent.

## Differentiation

A prominent gradient emerald summary card that stacks the student avatar with three glassy stat pills — instantly readable at arm's length.

## Color Palette

| Token      | OKLCH        | Role                                        |
| ---------- | ------------ | ------------------------------------------- |
| background | 0.975 0.008 150 | Cream off-white app canvas                  |
| foreground | 0.21 0.03 158   | Deep green-black body text                  |
| card       | 0.995 0.003 150  | Elevated white content cards                |
| primary    | 0.45 0.11 156    | Islamic emerald — headers, active tabs, CTA |
| accent     | 0.62 0.13 152    | Lighter green for badges, indicators        |
| gold       | 0.72 0.13 78     | Reverent amber for Infak/finance highlights |
| muted      | 0.94 0.014 150   | Row tints, filter backgrounds               |
| success    | 0.58 0.15 152    | Present/verified states                     |
| destructive | 0.55 0.21 27    | Alpa/rejected states                        |

## Typography

- Display: Space Grotesk — headings, stat numbers, tab labels (tight tracking)
- Body: DM Sans — paragraphs, table cells, form labels
- Mono: JetBrains Mono — NISN, nominal amounts (optional)
- Scale: hero `text-3xl font-bold tracking-tight`, h2 `text-xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase`, body `text-sm`

## Elevation & Depth

White cards on cream canvas use `shadow-card`; the primary summary card uses `shadow-elevated` plus `bg-gradient-primary`; no glow, no neon — depth via layered green surfaces.

## Structural Zones

| Zone    | Background             | Border     | Notes                                    |
| ------- | ---------------------- | ---------- | ---------------------------------------- |
| Header  | `bg-card` / gradient   | `border-b` | Sticky; emerald summary card hero        |
| Content | `bg-background`        | —          | Alternate `bg-muted/40` sections         |
| Footer  | `bg-card` bottom tabs  | `border-t` | Fixed 5-tab nav, `pb-safe`, active green |

## Spacing & Rhythm

Section gaps `space-y-5`, card padding `p-4`, table row height 44px for touch; micro-spacing `gap-2`/`gap-3` for stat pills and badges.

## Component Patterns

- Buttons: `rounded-xl`, primary emerald or `bg-gradient-primary`, hover `shadow-elevated`, min-h-11
- Cards: `rounded-2xl bg-card border border-border shadow-card`
- Badges: pill `rounded-full`, green for grades, gold for infak, red for alpa
- Tabs: segmented pill control, active `bg-primary text-primary-foreground`

## Motion

- Entrance: `animate-fade-in` staggered on cards, 0.35s
- Hover: `transition-smooth`, shadow lift on cards and buttons
- Decorative: `animate-scale-in` on sheets/dialogs; no bouncy motion

## Constraints

- Mobile-first only; layout optimized for 390px, scales up gracefully
- AA+ contrast in both light and dark; never rely on opacity for legibility
- No raw color literals or arbitrary Tailwind colors — semantic tokens only
- Generous touch targets (min 44px) and tabular numbers for tables

## Signature Detail

The emerald gradient summary card with frosted stat pills — a typographic and material treatment that anchors the entire dashboard identity.
