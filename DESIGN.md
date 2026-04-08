# Design Brief

## Direction
SchoolDesk — A light, minimal educational ERP platform with high data density, professional authority, and refined role-based visual systems for Admin/Teacher/Student access.

## Tone
Refined minimalism with structured clarity: trustworthy, institutional, designed for information density and quick decision-making on mobile.

## Differentiation
Role-indicator visual system: Admin dashboard marked with deep indigo left border, Teacher with forest green, Student with neutral grey — instant role recognition at a glance.

## Color Palette

| Token          | OKLCH         | Role                              |
| -------------- | ------------- | --------------------------------- |
| background     | 0.98 0.008 260  | Light off-white, cool undertone   |
| foreground     | 0.18 0.015 260  | Deep charcoal, maximum readability |
| card           | 1.0 0.004 260   | Pure white, elevated surfaces     |
| primary        | 0.42 0.14 265   | Deep indigo, educational authority |
| accent         | 0.65 0.18 155   | Forest green, success & approval  |
| destructive    | 0.55 0.22 25    | Warm red, critical actions        |
| muted          | 0.94 0.01 260   | Light grey, disabled/secondary UI |

## Typography
- **Display**: Space Grotesk — Modern geometric sans, tech-forward headers and role labels. Used for dashboard titles, section headings, role indicators.
- **Body**: Plus Jakarta Sans — Clean, highly legible at small sizes. Critical for mobile and data tables.
- **Mono**: JetBrains Mono — Numeric tables, grades, fees, roll numbers, student IDs.
- **Scale**: Hero `text-4xl font-bold tracking-tight`, headings `text-2xl font-bold tracking-tight`, labels `text-sm font-semibold uppercase`, body `text-base`

## Elevation & Depth
Multi-tier card system: background (flat), card surfaces (subtle shadow 2px), modals/popovers (elevated shadow 8px). Minimal shadows reinforce information hierarchy without visual noise.

## Structural Zones

| Zone        | Background                | Border                    | Notes                                    |
| ----------- | ------------------------- | ------------------------- | ---------------------------------------- |
| Header      | `bg-card` with `border-b`   | 1px `border-muted`       | Sticky top, branding space                |
| Content     | `bg-background`             | —                         | Spacious breathing room                   |
| Dashboard   | Alternating `bg-background`/`bg-muted/5%` | —            | Cards separated by 2rem gaps              |
| Modals      | `bg-card`                  | 1px `border-muted`       | Elevated shadow, centered overlay        |
| Bottom Nav  | `bg-card` with `border-t`   | 1px `border-muted`       | Fixed bottom, 3 navigation items          |

## Spacing & Rhythm
Spacious layout (2rem/3rem gaps between sections) with compact micro-spacing (0.5rem–1rem inside cards). Breath over density—dashboard cards float with subtle separation, not grid-packed.

## Component Patterns
- **Buttons**: Rounded-lg (6px), primary indigo with white text, secondary muted background, hover opacity shift
- **Cards**: Rounded-lg white surface, subtle shadow, left border accent (4px) indicates role/status
- **Badges**: Rounded-full, `bg-accent` for approval/complete, `bg-destructive` for pending/overdue, `bg-muted` for neutral
- **Data Tables**: Monospace numerics, alternating row backgrounds (subtle), tight row spacing, header row pinned
- **Forms**: Full-width inputs with `border-input`, clear labels above, inline validation messages

## Motion
- **Entrance**: Cards fade in with subtle 300ms delay (staggered). Bottom nav appears instantly.
- **Hover**: Interactive elements use `transition-smooth` (300ms), buttons shift opacity, cards lift slightly via shadow increase.
- **Decorative**: None—focus on clarity and speed.

## Constraints
- No dark mode—light aesthetic primary for school printability and accessibility.
- Minimum 16px tap targets for mobile buttons and navigation.
- Role-specific borders on cards provide visual status without color-only differentiation (accessibility).
- Chart colors (`--chart-1` to `--chart-5`) carefully selected for WCAG AA contrast on light background.

## Signature Detail
Role indicator left borders on dashboard cards—a 4px accent strip (Admin=indigo, Teacher=green, Student=grey) provides instant contextual status without redundant badges or labels.
