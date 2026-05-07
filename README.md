# GGType

> **Type fast or get rekt.**

---

<!-- CAPSULE ART — 460×215 -->
![GGType capsule art](docs/images/capsule.png)

---

A gamer-focused typing arena styled as an esports HUD. Train your reflexes by typing real in-game callouts from Overwatch, Dota 2, and League of Legends — inside a live team-chat interface that reacts to how well (or how badly) you're playing.

---

## ABOUT THIS GAME

GGType turns typing practice into a match. You're in a team chat. Your teammates are talking. The enemy is flaming. And you need to type your line — perfectly — before the clock hits zero.

Two modes. Zero chill.

---

<!-- SCREENSHOT 1 — LOBBY / SETTINGS GATE -->
![Lobby screen](docs/images/screenshot-lobby.png)

### ★ HYPE MODE
Your team cheers you on. Allies drop encouragement. The chat is warm. The accent is green. The pressure is still very real.

---

<!-- SCREENSHOT 2 — IN-GAME HYPE -->
![Hype mode gameplay](docs/images/screenshot-hype.png)

### ☠ RAGE MODE
Zero mercy. Teammates flame. Enemies flame harder. Every typo is a personal failure. The screen turns red and so does your face.

> **Auto-Rage** — if your accuracy drops below 85% after 12 characters, the game switches to Rage Mode on its own. You earned it.

---

<!-- SCREENSHOT 3 — IN-GAME RAGE -->
![Rage mode gameplay](docs/images/screenshot-rage.png)

---

## FEATURES

| | |
|---|---|
| **Esports HUD** | Full three-column layout: live player stats, team chat, match history — styled like a tournament overlay |
| **Live team chat** | Ambient messages from allies and enemies fire in real time as you type |
| **3 game universes** | Overwatch · Dota 2 · League of Legends word pools |
| **EN / TH** | English and Thai sentence packs |
| **4 durations** | 15s · 30s · 60s · 120s |
| **Match history** | Last 25 runs tracked locally — WPM, accuracy, sentences, errors |
| **5 color themes** | Switchable accent palettes via the Tweaks panel |
| **Glitch wordmark** | Fully animated RGB-split GGType logo |
| **Countdown** | 3-2-1 GO! overlay before every match |
| **Results screen** | Post-match breakdown with contextual headline based on mode and language |

---

<!-- SCREENSHOT 4 — RESULTS SCREEN -->
![Results screen](docs/images/screenshot-results.png)

---

## STATS TRACKED LIVE

- **WPM** — words per minute, calculated on correct characters
- **Accuracy** — correct keystrokes vs total keystrokes
- **Sentences sent** — messages fully typed and submitted
- **Errors** — every wrong keystroke logged and judged

The left panel updates in real time. The right panel remembers every run.

---

<!-- SCREENSHOT 5 — LEFT PANEL CLOSE-UP -->
![Player stats panel](docs/images/screenshot-panel.png)

---

## CONTROLS

| Key | Action |
|---|---|
| `TYPE` | Match the characters shown in the compose box |
| `ENTER` | Send the message (only when fully typed) |
| `TAB` | Skip to lobby / start a new match from anywhere |

---

## TECH

Built with **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS v4**

Fonts: JetBrains Mono · Space Grotesk · Noto Sans Thai — loaded via `next/font/google`, zero layout shift.

---

<!-- FOOTER ART -->
![GGType footer](docs/images/footer.png)

---

*be excellent to each other.* — or don't. rage mode is right there.
