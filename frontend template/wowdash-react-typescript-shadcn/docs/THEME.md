# TradePilot / Wowdash frontend — theme specification

This document describes the **visual system** of `wowdash-react-typescript-shadcn` so you can **reuse the same look** in another app (second product, embed, or migration) without reverse‑engineering the codebase.

---

## 1. Stack (what the theme depends on)

| Layer | Technology |
|--------|------------|
| **CSS** | Tailwind CSS **v4** (`@tailwindcss/vite`), `index.css` as single entry |
| **Design tokens** | **CSS variables** (OKLCH) on `:root` and `.dark` |
| **Components** | **shadcn/ui** preset **style: `new-york`**, **baseColor: `neutral`** (`components.json`) |
| **Primitives** | **Radix UI** primitives + `class-variance-authority`, `clsx`, `tailwind-merge` |
| **Icons** | **Lucide React** |
| **Dark mode** | Custom `ThemeProvider` toggles `light` / `dark` / `system` on `<html>` |
| **Fonts** | **Inter** (Google Fonts), loaded in `src/index.css` |

**Minimum to “look the same” in another React+Vite app:** copy `src/index.css`, wire Tailwind v4 the same way, wrap the tree with the same `ThemeProvider`, and keep semantic classes (`bg-background`, `text-foreground`, `border-border`, `text-primary`, etc.).

---

## 2. Files that define the theme

| File | Role |
|------|------|
| `src/index.css` | **Source of truth** — tokens, `@theme inline` bridge, base typography, scrollbars, ApexCharts tweaks, prompt box scrollbar |
| `src/components/theme-provider.tsx` | `light` / `dark` / `system` + `localStorage` persistence |
| `src/App.tsx` | Wraps app with `<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">` |
| `components.json` | shadcn config — `cssVariables: true`, `baseColor: neutral`, `css: src/index.css` |

Component files under `src/components/ui/*` consume tokens via Tailwind semantic classes (e.g. `bg-card`, `text-muted-foreground`).

---

## 3. Brand & intent

- **Primary accent** is a **warm peach / coral** (used for primary buttons, sidebar highlights, charts in dark mode).  
  - Comment in CSS: `/* Brand: logo gradient accent #feb687 */`  
  - Implemented as **OKLCH** primary (e.g. `--primary: oklch(0.79 0.12 55)` in light).
- **Neutrals** follow shadcn **neutral** scale; backgrounds are near-white in light and deep slate in dark.
- **Destructive** uses standard red OKLCH for errors and dangerous actions.

---

## 4. Semantic tokens (CSS variables)

These are the **contract** for styling. In React, prefer Tailwind classes that map to them:

- `bg-background` → `--background`
- `text-foreground` → `--foreground`
- `bg-card` / `text-card-foreground`
- `bg-primary` / `text-primary-foreground`
- `bg-muted` / `text-muted-foreground`
- `border-border`, `ring-ring`, `bg-destructive`, etc.

### 4.1 Light mode (`:root`)

Defined in `src/index.css` (abbreviated names; full values are in the file):

| Token | Purpose |
|--------|---------|
| `--radius` | Global corner radius base (**0.625rem**); `--radius-sm/md/lg/xl` derived |
| `--background` | Page background (white near `oklch(1 0 0)`) |
| `--foreground` | Main text |
| `--card` / `--card-foreground` | Cards, panels |
| `--popover` | Popovers / dropdown surfaces |
| `--primary` / `--primary-foreground` | Brand CTA, active nav |
| `--secondary` / `--secondary-foreground` | Secondary surfaces |
| `--muted` / `--muted-foreground` | Subtle fills and helper text |
| `--accent` / `--accent-foreground` | Hover accents |
| `--destructive` | Errors / delete |
| `--border`, `--input`, `--ring` | Borders, inputs, focus rings |
| `--chart-1` … `--chart-5` | Data visualization palette |
| `--sidebar-*` | Sidebar-specific (aligned with primary in light) |

### 4.2 Dark mode (`.dark` on `<html>`)

Same token **names**; values shift to dark slate backgrounds, light text, softer borders (`oklch(1 0 0 / 10%)`), and chart colors tuned for dark UI.

### 4.3 Sidebar note

`index.css` contains **two** `@layer base` blocks that set `--sidebar-*` (lines ~360–380). The **last** block wins for those variables. When integrating, treat **`src/index.css` as the single source** — avoid duplicating sidebar tokens elsewhere.

---

## 5. Typography

- **Font:** `Inter`, weights 100–900.  
  Import: `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");`
- **Body:** `font-family: "Inter", sans-serif` on `body`.
- **Headings `h1`–`h6`:** `clamp()` fluid sizes + `font-semibold` (see `@layer base` in `index.css`).

---

## 6. Radius scale

| CSS | Typical use |
|-----|----------------|
| `--radius-sm` | `calc(var(--radius) - 4px)` |
| `--radius-md` | `calc(var(--radius) - 2px)` |
| `--radius-lg` | `var(--radius)` |
| `--radius-xl` | `calc(var(--radius) + 4px)` |

Tailwind: `rounded-lg` maps through `--radius` in the theme pipeline.

---

## 7. Dark mode behavior

1. `ThemeProvider` (`src/components/theme-provider.tsx`) stores `light` | `dark` | `system` in `localStorage` (default key: `vite-ui-theme`).
2. On change, it sets **`class` on `document.documentElement`**: `light` or `dark` (for `system`, it follows `prefers-color-scheme` and listens for changes).
3. All semantic colors switch because `.dark { ... }` overrides the same `--*` variables.

**Usage in components:**

```tsx
import { useTheme } from "@/components/theme-provider";
const { theme, setTheme } = useTheme();
setTheme("dark");
```

---

## 8. Tailwind v4 `@theme` bridge

`index.css` uses `@theme inline { ... }` to map **CSS variables** to **Tailwind color names** (`--color-background`, `--color-primary`, …). That is why classes like `bg-primary` work without hardcoding hex in components.

Custom breakpoint: `--breakpoint-3xl: 120rem` (optional).

---

## 9. Extra layers (not “core shadcn”, but part of this UI)

- **Scrollbars:** `.scrollbar-thin`, `.scrollbar-invisible`, `.hover:scrollbar-visible` (WebKit) — slate thumb colors.
- **Cards:** `.card` in `@layer components` — white / `#273142` dark, padding, border.
- **ApexCharts:** Several `.apexcharts-*` overrides for dark mode, tooltips, legends.
- **Prompt box:** `.ai-prompt-box-scope` — focus outline and textarea scrollbar.

If you port the theme **without** charts or the prompt box, you can omit those sections.

---

## 10. Integration checklist (another Vite + React app)

1. **Dependencies (align with this project):**  
   `tailwindcss` v4 pipeline (`@tailwindcss/vite`), `react`, `react-dom`, shadcn-style utilities (`clsx`, `tailwind-merge`, `class-variance-authority`), Radix primitives as needed for copied components.

2. **Vite:** Add `tailwindcss()` plugin (see `vite.config.ts`).

3. **Copy** `src/index.css` (or merge its `:root`, `.dark`, `@theme`, and `@layer` sections into your global CSS).

4. **Copy** `src/components/theme-provider.tsx` and wrap your app:

   ```tsx
   <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
     {children}
   </ThemeProvider>
   ```

5. **Import** global CSS once in `main.tsx`: `import "./index.css"`.

6. **Use semantic classes** in JSX: `bg-background text-foreground border-border`, etc. — do not hardcode `#fff` for surfaces if you want dark mode to work.

7. **shadcn:** Run `npx shadcn@latest init` with `components.json` matching **new-york** + **neutral** + **cssVariables**, or copy `components/ui` from this repo.

8. **Path alias:** `@` → `src` (see `vite.config.ts`).

---

## 11. Quick token reference (copy for design tools)

| Semantic role | Tailwind class | Underlying variable |
|----------------|----------------|----------------------|
| Page background | `bg-background` | `--background` |
| Main text | `text-foreground` | `--foreground` |
| Muted text | `text-muted-foreground` | `--muted-foreground` |
| Primary CTA | `bg-primary text-primary-foreground` | `--primary`, `--primary-foreground` |
| Card | `bg-card text-card-foreground` | `--card`, `--card-foreground` |
| Border | `border-border` | `--border` |
| Destructive | `bg-destructive` | `--destructive` |

---

## 12. Changing the brand color

1. Adjust `--primary` and `--primary-foreground` in **both** `:root` and `.dark` in `src/index.css`.  
2. Optionally align `--sidebar-primary` and chart `--chart-*` if you want charts and sidebar to match.  
3. Keep **contrast** OK for WCAG on `primary-foreground` text on `primary` buttons.

---

## 13. Version / maintenance

- **Theme file:** `src/index.css`  
- **Toggle:** `src/components/theme-provider.tsx`  
- **App entry:** `src/App.tsx`  

When upgrading Tailwind or shadcn, re-run their migration guides and diff `index.css` against this file.
