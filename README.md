# Mood Tracker Desktop 🌤️

A desktop mood-tracking app built with **Electron**, vanilla JS, and an XML rule engine. Answer a short daily check-in, get personalized tips and motivation based on your answers, and track your mood history on a calendar — all running locally, no server or account required.

## Features

- 📝 **10-question daily check-in** — mood, sleep, stress, energy, focus, social interaction, appetite, exercise, time outdoors, and overall balance
- 💡 **Rule-based tips & motivation** — responses are matched against rules in `mood-rules.xml` (a RuleML-style ruleset) to generate personalized tips, a motivational message, and a diary prompt; falls back to a built-in rule set if the file can't be read
- 📅 **Mood calendar** — month and year-at-a-glance views of past check-ins, with a popup to review any saved day
- 🎨 **Light/dark theme toggle** with animated transitions
- 🎵 **Background audio** — calming music, meditation, or nature sounds, togglable from Settings
- 🎉 **Confetti celebration** with a user-customizable color
- 💾 **Local persistence** — choose between `localStorage` or `sessionStorage` for saving your history
- ♿ **Accessibility** — keyboard navigation and visible focus outlines throughout
- 🖥️ **Packaged as a native Windows desktop app** via Electron Forge (Squirrel installer + zip)

## Tech Stack

- **Shell:** Electron 38
- **UI:** Vanilla HTML/CSS/JS (no framework)
- **Rules engine:** Custom RuleML-style XML, parsed client-side with `DOMParser`
- **Packaging:** Electron Forge (`maker-squirrel`, `maker-zip`, `maker-deb`, `maker-rpm`)

## Project Structure

```
mood-tracker-desktop/
├── electron.js            # Electron main process — creates the app window
├── package.json            # App metadata, scripts, Electron Forge config
├── src/
│   ├── index_new.html       # Main app window (loaded by electron.js)
│   ├── script.js              # All app logic: questions, rule engine, calendar, audio, theming
│   ├── mood-rules.xml          # RuleML-style tip/motivation rules, read via Node's fs at runtime
│   ├── base.css                 # Reset, utility classes, and shared animations
│   ├── theme.css                 # CSS variables (light/dark palettes) + header/theme styling
│   ├── components_new.css         # Component-level styles (buttons, panels, cards, calendar, etc.)
│   ├── style.css                   # Extra background-transition animation for dark mode
│   ├── calming-music.mp3            # Background audio track
│   ├── meditation.mp3                # Background audio track
│   └── nature-sounds.mp3              # Background audio track
```

> **Note:** `electron.js` loads `src/index_new.html`, so all the app's HTML/CSS/JS/audio/XML assets above should live inside `src/`.

## How it works

- `script.js` reads `mood-rules.xml` from disk using Node's `fs`/`path` modules (enabled because `electron.js` sets `nodeIntegration: true` and `contextIsolation: false`). If the file is missing or fails to parse, it falls back to an equivalent rule set embedded directly in the script.
- Each rule matches an answer (e.g. `mood = anxious`) to an output (`tip`, `motivation`, or `diaryPrompt`). Matching rules are collected and the top results are shown after the last question.
- Mood history is saved to whichever web storage you pick in Settings, and read back to populate the calendar view.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Run in development

```bash
npm install
npm start
```

This launches the Electron window with DevTools open (see `win.webContents.openDevTools()` in `electron.js` — comment that line out once you're done debugging).

### Build a distributable

```bash
npm run package   # produces an unpacked app folder
npm run make       # produces installers (Squirrel .exe, .zip) per the Forge config in package.json
```

Build output lands in `out/` (Electron Forge default) — this is what produces the `mood-tracker-desktop.exe` and supporting Chromium/Electron files (`resources.pak`, `ffmpeg.dll`, `LICENSES.chromium.html`, etc.) seen in a packaged build.

## Known issues / things to check before shipping

- **Content-Security-Policy vs. Google Fonts:** `index_new.html` sets `style-src 'self' 'unsafe-inline'` but also links to `https://fonts.googleapis.com/...` for the "Great Vibes" font. That stylesheet request will be blocked by the CSP as written — either add `https://fonts.googleapis.com` to `style-src` (and `https://fonts.gstatic.com` to a `font-src` directive), or bundle the font file locally instead.
- **Duplicate markup:** `index_new.html` currently has two `<section id="mood-calendar-panel">` blocks (and two `#calendar-container` divs) — worth removing the older/unused one to avoid duplicate-ID bugs.
- **`nodeIntegration: true` / `contextIsolation: false`:** convenient for reading local files directly from the renderer, but it's an Electron anti-pattern from a security standpoint if you ever load any remote or untrusted content. Fine for a fully local app like this, but worth keeping in mind if the app grows.
- Don't commit `node_modules/` or the `out/`/packaged build folder to git — add them to `.gitignore`.

