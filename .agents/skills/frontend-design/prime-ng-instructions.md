# Project Guidelines: Angular + PrimeNG (SCSS/BEM)

This document provides architectural, structural, and aesthetic guidelines to maintain the premium, fintech-inspired design system established in the **KeepPenny (pft)** project. Use these instructions when scaffolding new features or handing off tasks to an AI agent (like Antigravity).

## 1. Tech Stack Overview

- **Framework:** Angular 18+ (Standalone Components)
- **UI Library:** PrimeNG 18+
- **Theming:** PrimeNG **Aura** Theme (via custom `FreyaPreset`)
- **Styling Methodology:** SCSS with **BEM** (Block Element Modifier) architecture. **No Tailwind CSS is actively used for component layout.**
- **Icons:** PrimeIcons (`pi`)

## 2. Component Architecture & Structure

- **Atomic Design Pattern:** UI components are strictly separated into atomic levels:
  - `src/app/ui/` (molecules, organisms, templates) for reusable generic UI pieces (e.g., `app-topbar`, `transaction-list`).
- **Feature-Based Pages:** Full views and business logic reside in `src/app/features/` (e.g., `transactions`, `dashboard`).
- **Standalone Components:** All new components must be Angular Standalone Components (`standalone: true`).
- **Styling Isolation:** Every component MUST have its own `.scss` file using BEM methodology (e.g., `.transactions-page`, `.transactions-page__header`, `.stat-value--income`). Do not use utility classes in the HTML.

## 3. Theming & Dark Mode

The project leverages a custom `FreyaPreset` on top of PrimeNG's Aura preset.

- **Primary Color:** The semantic primary is Emerald Green (`#34d399`).
- **Dark Mode Strategy:** Dark mode is toggled via the `.app-dark` class applied to the root element. This switches the CSS variables in `styles.scss` and sets `color-scheme: dark;`.
- **Button Contrast:** The dark mode overrides `.p-button.p-button-primary` text to a dark green (`#064e3b`) to maintain contrast against the light green brand background. Ensure any primary solid element accounts for this contrast.

## 4. Color Palette (CSS Variables)

To achieve the premium look, STRICTLY use the following CSS variables defined in `styles.scss`. **Never hardcode hex values in component SCSS files.**

### Layout Variables

- `--app-bg`: The main application background (Light: `#f5f7fa`, Dark: `#09090b`).
- `--app-surface-color`: Card, panel, and sidebar backgrounds (Light: `#ffffff`, Dark: `#18181b`).
- `--app-hover-bg`: Use for hoverable list items or custom table rows.
- `--app-border-color`: Use universally for dividers, card borders, and layout lines.

### Text Variables

- `--app-text-color`: Primary text color for headings and main text.
- `--app-muted-text-color`: Secondary text color for subtitles, labels, and timestamps.

### Financial Semantic Variables

- `--income-color`: Green used for positive cash flow / income (Light: `#10b981`, Dark: `#34d399`).
- `--expense-color`: "Matte Rose"/Red used for negative cash flow / expenses (Light: `#f43f5e`, Dark: `#fb7185`).

## 5. Premium UI/UX Aesthetics

To replicate the "premium fintech" feel across all screens, follow these structural rules in your SCSS:

- **Card Styling:** Cards should have a soft, modern look. Use this exact pattern:
  ```scss
  background: var(--app-surface-color);
  border: 1px solid var(--app-border-color);
  border-radius: 1rem; /* Premium, pronounced rounding */
  padding: 1.25rem;
  ```
- **Typography & Labels:**
  - Standard font: `Inter, 'Segoe UI', Roboto, sans-serif`.
  - Section Titles: Use `font-size: 1.75rem; font-weight: 700;`.
  - Subtitles: Use `color: var(--app-muted-text-color); margin-top: 0.5rem;`.
  - Micro-Labels (like inside stat cards): Use `font-size: 0.825rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; color: var(--app-muted-text-color);`.
- **Spacing & Layout (Grid/Flex):**
  - Use Flexbox (`display: flex; gap: 1.5rem; flex-direction: column;`) for page rhythms.
  - Use CSS Grid (`display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;`) for responsive KPI cards.

## 6. PrimeNG Component Guidelines

When using PrimeNG components, align them with the app's style:

- **`<p-button>`**:
  - Use `severity="secondary"` and `[outlined]="true"` or `[text]="true"` for non-primary actions.
  - Use `[rounded]="true"` for icon-only buttons (like theme toggle or settings).
- **Inputs & Search**:
  - Wrap search inputs in `<p-iconfield>`. Use `<p-inputicon styleClass="pi pi-search" />` inside it.

## 7. Navigation Layout (Sidebar & Topbar)

The navigation shell uses a responsive dual-mode strategy utilizing PrimeNG and CSS Grid:

- **Hamburger Menu (Topbar):**
  - Placed in the topbar. Use an icon-only button: `<p-button styleClass="menu-toggle" icon="pi pi-bars" [text]="true" [rounded]="true" (onClick)="toggleSidebar.emit()" />`.
- **Desktop Sidebar (`<aside>`):**
  - Managed by a CSS Grid wrapper (`.shell-body { grid-template-columns: 18rem 1fr; }`).
  - Navigation links (`.nav-item`) use `display: flex; gap: 0.75rem; border-radius: 0.625rem; font-weight: 500;`.
  - Hover state changes `background` to `var(--app-hover-bg)`.
  - Active links (`.nav-item-active`) use `background: var(--brand-soft-bg)` and `color: var(--brand-primary)`.
  - Collapsed state (`.sidebar-nav-collapsed`) hides labels (`span { display: none; }`) and centers the icons.
- **Mobile Sidebar (`<p-drawer>`):**
  - Use `<p-drawer>` for mobile navigation (`@if (isMobileView())`).
  - Configuration: `[modal]="true"`, `[dismissible]="true"`, `[showCloseIcon]="true"`, `position="left"`.
  - Apply `styleClass="sidebar-mobile-drawer"` to set explicit widths in global `app.scss` via `:host ::ng-deep .sidebar-mobile-drawer { width: 18rem; }`.
  - Inject the custom brand header using `<ng-template pTemplate="header">`.

---

**Summary for Agents:** When generating new UI features, do NOT use Tailwind classes. Write semantic HTML and pair it with a BEM-structured SCSS file. Always use `var(--app-surface-color)` for cards, `var(--app-border-color)` for outlines, and `var(--app-muted-text-color)` for secondary text. Enforce a `1rem` border radius on interactive blocks and respect the dark mode variable overrides.
