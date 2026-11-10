---
name: Market Precision
colors:
  surface: '#faf9ff'
  surface-dim: '#d7d9e6'
  surface-bright: '#faf9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#ebedfa'
  surface-container-high: '#e5e8f4'
  surface-container-highest: '#e0e2ee'
  on-surface: '#181b24'
  on-surface-variant: '#434656'
  inverse-surface: '#2d303a'
  inverse-on-surface: '#eef0fd'
  outline: '#737687'
  outline-variant: '#c3c5d8'
  surface-tint: '#004ee8'
  primary: '#0049db'
  on-primary: '#ffffff'
  primary-container: '#2962ff'
  on-primary-container: '#f7f5ff'
  inverse-primary: '#b6c4ff'
  secondary: '#5a5e6b'
  on-secondary: '#ffffff'
  secondary-container: '#dfe2f2'
  on-secondary-container: '#606471'
  tertiary: '#9e3500'
  on-tertiary: '#ffffff'
  tertiary-container: '#c74500'
  on-tertiary-container: '#fff4f1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001550'
  on-primary-fixed-variant: '#003ab3'
  secondary-fixed: '#dfe2f2'
  secondary-fixed-dim: '#c3c6d5'
  on-secondary-fixed: '#171b26'
  on-secondary-fixed-variant: '#434653'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#faf9ff'
  on-background: '#181b24'
  surface-variant: '#e0e2ee'
  bull-green: '#089981'
  bear-red: '#F23645'
  surface-bg: '#FFFFFF'
  surface-subtle: '#F0F3FA'
  surface-hover: '#E0E3EB'
  border-subtle: '#E0E3EB'
  badge-sp500: '#D83A56'
  badge-nasdaq: '#089981'
  badge-dow: '#0088CC'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  data-mono-num:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 3rem
---

## Brand & Style

The design system establishes a high-performance, institutional-grade market data environment engineered for retail traders, institutional analysts, and macro investors alike. The emotional response is one of velocity, absolute clarity, and analytical trust. Information density is treated as a premium utility: every pixel serves legibility and financial situational awareness without visual noise or gratuitous decoration.

Drawing from modern high-density financial interfaces and functional minimalism, the aesthetic pairs razor-sharp typography with a strict tonal hierarchy. Structural elements lean on low-contrast dividers, muted surface backgrounds, and pill-shaped filter controls. Accent colors are reserved strictly for directional price movement (bullish green vs. bearish red) and primary interactive triggers, preserving visual energy for rapid data scanning.

## Colors

The color architecture enforces strict functional roles:

- **Primary Interactive (`#2962FF`)**: Deployed exclusively for active navigation states, interactive text links, primary focus outlines, and key CTA accents.
- **Secondary (`#131722`)**: The foundational deep obsidian tone used for primary typography, dominant headline elements, and the solid "Get started" call-to-action button.
- **Market Sentiment Tokens**:
  - `bull-green` (`#089981`): Denotes positive price delta, gains, upward sparklines, and bullish momentum indicators.
  - `bear-red` (`#F23645`): Signals negative percentage change, price contractions, and downward sparklines.
- **Surface Hierarchy**:
  - `surface-bg` (`#FFFFFF`): Main canvas and elevated modal backgrounds.
  - `surface-subtle` (`#F0F3FA`): Pill rail containers, search input fills, and secondary card containers.
  - `surface-hover` (`#E0E3EB`): Row hover feedback and active state interactions.
  - `border-subtle` (`#E0E3EB`): Hairline boundary dividers separating high-density tables and sticky toolbars.
- **Categorical Asset Badges**: Distinct high-recognition fills for major indices (`#D83A56` for S&P 500, `#089981` for Nasdaq, `#0088CC` for Dow).

## Typography

The design system uses **Inter** across all UI tiers. Its neutral architecture and wide aperture guarantee optimal legibility when presenting numerical density, fractional quotes, and small-scale ticker symbology.

### Critical Rules
- **Tabular Lining Figures**: All financial numbers, ticker prices, volume counters, and percentage badges must render with `font-feature-settings: "tnum" 1, "cv05" 1` to eliminate horizontal jitter during real-time tick streaming.
- **Display Weights**: Primary headers use weights 700 to 800 with tight negative tracking (`-0.02em` to `-0.03em`) to anchor overview sections with authoritative presence.
- **Labels & Navigation**: Navigation links and asset category pills use `label-md` (13px, Medium) for balanced vertical alignment within 32px pill containers.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid system bounded by a max container width of 1440px.

### Breakpoints & Behavior
- **Desktop (≥ 1200px)**: 12 columns, 24px gutters (`gutter-lg`), 40px outer margin (`margin-lg`). Full horizontal asset-class pill tabs stay visible in a single non-wrapping row. Financial cards display 3 or 4 across.
- **Tablet (768px – 1199px)**: 8 columns, 16px gutters, 24px outer margin (`margin-md`). Asset category pills switch to an overflow scroll container with subtle horizontal fade edges.
- **Mobile (< 768px)**: 4 columns, 12px gutters, 16px outer margin (`margin`). Financial tables convert to sticky first-column layouts with horizontal data panning. Search collapses into an icon toggle or dedicated pinned bar.

### Spacing Rhythm
Component padding uses tight 4px and 8px baseline intervals (`space-xs`, `space-sm`, `space-md`) to ensure high density within market tables and indices ticker ribbons without feeling cramped.

## Elevation & Depth

Visual hierarchy is maintained via **tonal layering and hairline dividers** rather than drop shadows, ensuring clarity for dense data presentation:

- **Level 0 (Base Canvas)**: Pure white (`#FFFFFF`) background.
- **Level 1 (Surface Containers)**: Soft fill (`#F0F3FA`) for pill bar rails, search input elements, ticker overview pills, and table headers. No shadow.
- **Level 2 (Dropdowns & Overlays)**: Pure white surface with a fine hairline border (`1px solid #E0E3EB`) accompanied by a diffused, low-opacity ambient drop shadow: `0 4px 16px rgba(19, 23, 34, 0.08)`.
- **Level 3 (Modal Dialogs & Command Palettes)**: `0 12px 32px rgba(19, 23, 34, 0.14)` with backdrop-filter blur (`blur(4px)`).
- **Interactive Focus**: 2px solid ring in `#2962FF` with zero offset to guarantee distinct accessibility compliance across keyboard navigation.

## Shapes

The design system embraces a **Pill-shaped (Level 3)** geometry for buttons, search fields, asset tabs, and ticker badges, juxtaposed against clean, rectilinear container cards:

- **Buttons & Pills**: 9999px (full capsule/pill shape) for category selectors, asset class tabs, CTA buttons, and ticker delta badges.
- **Inputs**: Full pill radius for the persistent global navigation search bar.
- **Cards & Data Modules**: Soft rounded corners (`8px` to `12px`) with subtle `1px` borders (`#E0E3EB`) to frame multi-metric data tables.
- **Index Badges**: Fully circular (`50%` / 32px × 32px) circular identifiers housing stock index identifiers (e.g., 500, 100, 30).

## Components

### Top Navigation Bar
- **Dimensions**: Fixed 64px height, full width with bottom `1px solid #E0E3EB`.
- **Elements**: 
  - Brand mark on the far left.
  - Global search field: 36px height, rounded full pill, background `#F0F3FA`, placeholder text `Search (Ctrl+K)` in `#787B86` with a leading search icon.
  - Primary text navigation links: `label-md`, color `#131722`, hover color `#2962FF`. Active tab features primary blue coloring or an understated indicator.
  - Right utility actions: Language selector (`EN`) with globe icon, user profile icon button, and primary action button.
- **Action Button ("Get started")**: Dark obsidian fill (`#131722`), white text, pill-shaped radius, 36px height, horizontal padding `16px`, subtle hover transition to `#2A2E39`.

### Pill Navigation Tabs (Asset Classes)
- **Container**: Borderless or encapsulated inside a subtle pill housing (`#F0F3FA` background with 4px inner padding).
- **Tabs**: "US stocks", "World stocks", "Crypto", "Futures", "Forex", "Government bonds", "Corporate bonds", "ETFs", "Economy".
- **States**:
  - *Active Tab*: Solid black fill (`#131722`), crisp white text, full pill radius, horizontal padding 14px, height 32px.
  - *Inactive Tab*: Transparent background, `#131722` or `#787B86` text, hover background `#E0E3EB` with text transitioning to dark.

### Indices Ticker Cards & Summaries
- **Card Anatomy**: Rounded rectangle (`12px` border radius), background `#F0F3FA` or white with `1px solid #E0E3EB`, padding `16px`.
- **Circular Badge**: 32px × 32px circle on the left with prominent numbers ("500" in red, "100" in cyan/green, "30" in blue), accompanied by the index title (e.g., "S&P 500", "Nasdaq 100", "Dow 30") in `headline-sm`.
- **Value & Change**: High-visibility price in `data-mono-num` accompanied by percentage change pill (+0.42% in `#089981` or -0.38% in `#F23645`).
- **Sparkline Indicator**: Embedded inline SVG path placeholder (80px × 28px) displaying smooth intraday curve matching sentiment color.

### Financial Tables & Lists
- **Header**: Height 36px, typography `label-sm` uppercase, color `#787B86`, right-aligned for all numeric columns (Price, Change %, Volume, Market Cap), left-aligned for Symbol & Name.
- **Rows**: Fixed 44px or 48px height, alternating transparent backgrounds with `#F0F3FA` hover state, bottom border `1px solid #F0F3FA`.
- **Ticker Cells**: Two-tier layout displaying ticker symbol (bold `13px`) above company name (`11px` muted gray).

### Sentiment Badges & Deltas
- **Pill Badges**: Full pill radius, 22px height, 6px horizontal padding.
- **Bullish**: Font color `#089981`, background `rgba(8, 153, 129, 0.12)`.
- **Bearish**: Font color `#F23645`, background `rgba(242, 54, 69, 0.12)`.
- **Prefix**: Always prepend explicit `+` or `−` sign with directional micro arrow.