# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
npm start        # Launch the Electron app
```

No build step, linter, or test suite is configured.

## Architecture

This is a single-window Electron app following the standard three-layer structure:

- **`main.js`** — Main process. Creates a fixed-size (400×580) `BrowserWindow` with sandbox enabled. Handles two IPC channels: `show-notification` (system notification via Electron's `Notification` API) and `toggle-always-on-top`.
- **`preload.js`** — Bridge between main and renderer. Exposes `window.electronAPI.showNotification()` and `window.electronAPI.toggleAlwaysOnTop()` via `contextBridge`.
- **`renderer/`** — Renderer process (no Node access).
  - `index.html` — UI shell with CSP (`script-src 'self'`, `media-src 'none'`).
  - `styles.css` — CSS custom properties for theming. Work mode uses `--accent-work` (#C65A4A); break mode adds `body.break-mode` class to switch to `--accent-break` (#7A9E9F).
  - `renderer.js` — All timer logic, audio, and UI updates. No framework.

## Key renderer.js details

- **Audio**: `AudioContext` is lazy-initialized on first user click to satisfy Chromium's autoplay policy. Tones are synthesized via `OscillatorNode` + `GainNode` with fade-in/out to prevent click artifacts.
- **SVG progress ring**: `r=88`, `CIRCUMFERENCE = 2π×88 ≈ 552.92`. Progress is driven by `stroke-dashoffset`.
- **State**: A single mutable `STATE` object (`phase`, `secondsLeft`, `totalSeconds`, `isRunning`, `completedPomodoros`, `intervalId`). `CONFIG` holds durations and can be modified at runtime via the settings panel.
- **Phase flow**: work → short break (or long break every 4 pomodoros) → work. `enterPhase()` is the single entry point for all phase transitions.
