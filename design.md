# Design System: V Residences Ventspils

This document outlines the visual identity, typography, layout, and interaction patterns for the V Residences property landing page. The goal is to communicate clarity, quality, and investment confidence through an architectural, high-end, and restrained aesthetic.

## 1. Brand Philosophy
- **Keywords**: Architectural, Precise, Credible, Minimal, High-end.
- **Avoid**: Startup SaaS aesthetics, overused generic templates, excessive glowing effects, overly bouncy animations.
- **Tone**: Professional, factual, editorial. Focuses on spatial logic, structural integrity, and historical respect.

## 2. Color Palette
A restrained dark theme ensuring photography and accents stand out naturally.

| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Background (Primary)** | `#0F1115` | Deep charcoal. Primary background for the majority of the site. |
| **Surfaces (Light)** | `#F5F3EE` | Soft off-white. Used for contrasting sections (e.g., Flats Selection, Gallery) and primary text on dark backgrounds. |
| **Accent (Primary)** | `#C79643` | Warm muted amber. Used sparingly for primary CTAs, active states, key data highlights, and select icons. |
| **Accent (Hover)** | `#A9782D` | Secondary amber. Used for button hover states. |
| **Text (Secondary)** | `#8A9098` | Subtle gray. Used for body copy, descriptive text, and metadata on dark backgrounds. |
| **Borders & Dividers** | `#23262B` | Dark gray. Used for structural lines, grid divisions, and subtle containment without creating heavy "cards". |

## 3. Typography
The type system relies on a strong hierarchy, utilizing modern geometry mixed with an editorial serif for headings.

- **Primary Font (Sans-Serif)**: `Inter`
  - *Usage*: Body text, metadata, navigation, buttons, small all-caps labels.
  - *Characteristics*: Highly readable, geometric, modern.
- **Secondary Font (Serif)**: `Playfair Display`
  - *Usage*: `H1`, `H2`, `H3`, large numbers, and key architectural statements.
  - *Characteristics*: Confident, elegant, tightened letter spacing.

### Typographic Patterns
- **Micro-labels**: `text-[10px]` to `text-xs`, `uppercase`, `tracking-widest`. Used for section super-titles, data labels, and image captions.
- **Body**: `15px` to `18px`, `leading-relaxed`. High readability, uncrowded.
- **Headings**: `3xl` to `7xl`, `leading-tight` or `leading-[1.1]`. 

## 4. Layout & Grid System
- **Grid**: Standard 12-column grid (`grid-cols-12`) used for complex sections like Hero and Apartment Selection.
- **Containers**: Max width constrained to `max-w-7xl` (1280px) with generous horizontal padding (`px-6 lg:px-12`).
- **Vertical Spacing**: Generous section rhythms using `py-24` to `py-32` (96px - 128px) to allow content to breathe.
- **Borders over Boxes**: Minimal card UI. Separation is achieved through 1px solid borders (`border-[#23262B]`) and negative space rather than elevated containers with drop shadows.

## 5. UI Components

### Buttons & CTAs
- **Primary Button**: Solid fill `#C79643`, text `#0F1115`. 
- **Typography**: `text-sm`, `uppercase`, `tracking-widest`, `font-medium`.
- **Interaction**: On hover, background deepens to `#A9782D` and the button lifts slightly (`-translate-y-[2px]`).
- **Shape**: Sharp corners (`rounded-none`).

### Navigation & Tabs
- **Behavior**: Sticky header that transitions from transparent to a blurred backdrop (`bg-[#0F1115]/80 backdrop-blur-md`) upon scrolling.
- **Underline Tabs**: Active states in tabbed interfaces use an animated `2px` underline that smoothly slides between options using a layout transition.

### Forms & Inputs
- **Style**: Minimalist. No bounding boxes; inputs utilize only bottom borders (`border-b border-[#23262B]`).
- **Focus State**: Border color transitions to `#C79643` with zero outline.
- **Labels**: Small, uppercase, tracking-wider styling placed above the inputs.

## 6. Motion & Interaction

Animations are designed to be fluid, deliberate, and high-end, utilizing custom easing curves.

- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` is used universally to create a snappy start with a long, smooth deceleration.
- **Scroll Reveals**: Elements fade in (`opacity: 0` → `1`) and translate upward (`y: 20` or `30` → `0`) as they enter the viewport. Staggered transitions (`staggerChildren: 0.1`) are used for lists and grids.
- **Image Hover**: Galleries and structural images use a very slow, subtle scale effect (`scale-[1.03]` over `1.2s`) to add life without feeling aggressive.
- **Color Transitions**: Some images utilize `grayscale` and `mix-blend-luminosity` resting states that smoothly reveal full color and opacity upon hover.
