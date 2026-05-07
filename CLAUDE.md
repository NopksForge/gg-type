@AGENTS.md

# GGType — Project Context

## Stack
- Next.js 16.2.5 (App Router, Turbopack) · React 19 · TypeScript 5 · Tailwind v4

## Key file map
```
app/
  lib/word-packs.ts          — sentence data, getSentencePool(), AMBIENT_CHAT, CHAT_AUTHORS
  components/
    tweaks-panel.tsx          — useTweaks hook + all TweakPanel controls ('use client')
    gg-type-app.tsx           — full game UI and state machine ('use client')
  globals.css                 — GGType CSS (BEM, no Tailwind utilities used in the game)
  layout.tsx                  — loads JetBrains_Mono, Space_Grotesk, Noto_Sans_Thai via next/font/google
  page.tsx                    — thin server component, renders <GGTypeApp />
temp/                         — original single-file prototype (HTML + Babel), keep as reference
```

## Architecture rules
- **`'use client'`** on every interactive component — the entire game is client-side.
- **No SSR-unsafe state init.** Never read `localStorage` or call `Date.now()`/`Math.random()` inside `useState(() => ...)` — hydration will mismatch. Use `useEffect` to load from storage after mount; use `useState('')` for anything time-based.
- **CSS variables for fonts.** `layout.tsx` exposes `--font-jetbrains-mono`, `--font-space-grotesk`, `--font-noto-sans-thai`. `globals.css` maps them into `--font-mono` and `--font-disp` which the game CSS uses everywhere.
- **word-packs.ts is pure data** — no React, no browser APIs. Safe to import from anywhere.
- **`useTweaks<T>`** lives in `tweaks-panel.tsx`. It persists via `window.parent.postMessage` (no-op in production, used by the design tool). Call it as `const [t, setTweak] = useTweaks<TweakValues>(TWEAK_DEFAULTS)` and spread partials: `setTweak({ mode: 'rage' })`.

## Game state machine
`phase`: `'menu'` → `'countdown'` (3-2-1) → `'play'` → `'done'` → Tab key → `'menu'`

## Modes
- **hype** — green accent (`#7CFF3F`), supportive ambient chat
- **rage** — red accent (`#ff2d2d`), trash-talk ambient chat, auto-triggers if accuracy < 85% after 12 chars

## Word packs
Three game themes × two languages (EN/TH): `overwatch`, `dota2`, `lol`.
Each pack has `neutral`, `hype`, and `rage` sentence arrays. `getSentencePool()` merges neutral + mode flavor.

## History
Stored in `localStorage` under key `ggtype.history.v1` (max 25 entries). Loaded client-side only in `useEffect`.
