<div align="center">
  <img src="assets/icon.png" alt="NotebookLM-for-Windows Logo" width="160">

  <h1>NotebookLM for Windows</h1>
  <p><strong>A native desktop app for Google NotebookLM — Ghost Mode, Quick-Clip, multi-pane research, dark mode. Now on Windows, macOS, and Linux.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Electron-34-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron">
    <img src="https://img.shields.io/badge/Platform-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows">
    <img src="https://img.shields.io/github/license/GyaneshSamanta/NotebookLM-for-Windows?style=for-the-badge&color=22c55e" alt="License">
    <img src="https://img.shields.io/github/v/release/GyaneshSamanta/NotebookLM-for-Windows?style=for-the-badge&color=3385ff" alt="Latest Release">
    <img src="https://img.shields.io/github/downloads/GyaneshSamanta/NotebookLM-for-Windows/total?style=for-the-badge&logo=github&color=blue" alt="Downloads">
    <img src="https://img.shields.io/github/last-commit/GyaneshSamanta/NotebookLM-for-Windows?style=for-the-badge&color=ff00ea" alt="Last commit">
  </p>

  <p>
    <a href="../../releases">Download</a> ·
    <a href="#-quick-start">Quick Start</a> ·
    <a href="#-the-story">Story</a> ·
    <a href="#-for-developers">For Developers</a>
  </p>
</div>

> [!NOTE]
> **🎉 Thank you for 5,000+ downloads.** From a frameless Electron wrapper in February to a cross-platform research studio in May — every bug report, feature request, and 20-rupee [Buy Me A Chai](https://buymeachai.ezee.li/GyaneshOnProduct) (UPI supported) shaped what landed in v3.0. The project is now openly accepting contributions — see the [**Roadmap**](#-roadmap--v3-and-beyond) below for `good first issue` work that could ship in the next release.

---

## About — the 5 Ws

**What.** A native cross-platform desktop wrapper for Google NotebookLM, built on Electron, that turns the web app into a deeply integrated research utility — with transparency, customizable global hotkeys, multi-pane research (up to 3), dark mode, Markdown export, URL drop capture, and a mini Quick-Clip overlay.

**Who.** Built solo by **Gyanesh Samanta** ([@GyaneshSamanta](https://github.com/GyaneshSamanta)) — now openly accepting community contributions.

**When.** Active from **February 8, 2026 onwards** — v1.0 (wrapper), v2.0 (Ghost Mode + Quick-Clip + Split View), v2.1 (installer + auto-update), v3.0 (cross-platform + power-user features + open-source foundation).

**Where.** A nights-and-weekends project now in the hands of **5,000+** researchers, students, and analysts on Windows, macOS, and Linux who wanted NotebookLM to behave like a first-class desktop app.

**Why.** NotebookLM is a phenomenal research tool — but living in a browser tab means you lose half its leverage. No global hotkey to capture a clipping. No transparency to reference a PDF underneath. No way to compare two notebooks side-by-side without two browser windows. This app fixes all of that.

---

## The Story

It started as a simple Electron wrapper around `notebooklm.google.com` — a frameless window with a custom title bar, persistent login, and Windows toast notifications when an Audio Overview finished generating. Useful, but still mostly a tab-with-extra-steps. The first download numbers (a few hundred) suggested people wanted *more* than a wrapper.

Version 2.0 was the leap. **Ghost Mode** added an opacity slider to the title bar, so the entire window can fade to translucent — perfect for transcribing from a video underneath or copying from a PDF without the constant Alt-Tab dance. **Quick-Clip** registered a global `Ctrl+Alt+N` hotkey: copy text from anywhere, hit the chord, and NotebookLM jumps to the foreground and pastes the clipping into the active note instantly. **Split View** turned the single window into a two-pane research studio sharing the same login session — one notebook on brain-activity research, another on the Q3 earnings call, side-by-side without juggling tabs. **Native drag-and-drop** lets you fling PDFs, TXT, and Markdown straight onto the window to trigger NotebookLM's upload pipeline. Every one of these features answers a complaint I had personally — and apparently most of the **2,000+ downloads** so far had it too.

Version 2.1 was the boring-but-important release: a real NSIS installer, an electron-updater pipeline that ships updates in the background, and a portable `.exe` for users who don't want anything touching their registry. The whole stack stays delightfully thin — Electron 34, vanilla JS/HTML/CSS, two runtime deps (`auto-launch`, `electron-updater`).

**Version 3.0 is the 5,000-download milestone release.** It's the leap from "a Windows app for me" to "a research tool worth contributing to." A unified **settings system** with a real preferences panel. **Dark mode** with a proper CSS-variable palette. **Customizable global hotkeys** so power users can rebind Quick-Clip to whatever fits their muscle memory. **Always-on-top** for reference workflows. **Three-pane multi-view** for the research geeks. A **mini Quick-Clip overlay** that pops up at the cursor when the main window is hidden — no more forced foregrounding. **Markdown export** of your notes. **URL drop capture** so dragging a link from the browser pushes it as a source. And — finally — **macOS and Linux** builds via a cross-platform CI pipeline, with issue templates and a curated `good first issue` backlog so anyone reading this can ship the next feature.

---

## What's New in v3.0

| Feature | What it does |
|---|---|
| 🌐 **macOS + Linux** | First-class builds for Mac (`.dmg` / `.zip`) and Linux (`AppImage` / `.deb`) via cross-platform CI. |
| 🌙 **Dark Mode** | Full dark theme with CSS variables. Follows system or pick light / dark manually. |
| ⚙ **Settings Panel** | Unified preferences modal — theme, hotkey, always-on-top, default pane count, all in one place. |
| ⌨ **Customizable Hotkey** | Rebind Quick-Clip to any combo. Conflict-detected; reverts gracefully. |
| 📌 **Always-on-Top** | Pin the window above everything else — perfect for reference workflows. |
| 🪟 **3-Pane View** | Cycle 1 / 2 / 3 panes. Active-pane tracking routes Quick-Clip to where you're looking. |
| ✨ **Mini Quick-Clip Overlay** | When the main window is hidden, the hotkey shows a small overlay at the cursor — Enter to clip, Esc to cancel. |
| ⬇ **Markdown Export** | One click to export the current notebook's notes as a clean `.md` file. |
| 🔗 **URL Drop Capture** | Drag a link from your browser onto the window — it auto-fills NotebookLM's Add URL field. |
| 🩹 **Error / Retry UI** | When NotebookLM fails to load, you get a Retry button — not a blank pane. |
| 🤝 **Open to Contributors** | Issue templates, labels, CI, smoke tests, and a [Roadmap](#-roadmap--v3-and-beyond) of `good first issue` work. |

---

## Quick Start

### Download & Run

1. Grab the latest release from the [**Releases page**](../../releases).
2. Pick your flavour:
   - **Installer** (`-Setup.exe`) — recommended. Adds shortcuts and enables background auto-update.
   - **Portable** (`.exe`) — just download and run, nothing touches your system.
3. Run it. That's the whole setup.

> **Tip:** Pin `NotebookLM-for-Windows.exe` to your taskbar for one-click access.

> [!WARNING]
> **Upgrading from < v2.1?** Switch to the **Installer** build — that's where automatic background updates kick in.

---

## Full Feature List

| Feature | Description |
|---|---|
| 👻 **Ghost Mode** | Custom opacity slider to see through the window |
| ⚡ **Quick-Clip** | Global `Ctrl+Alt+N` hotkey for clipboard → note |
| 🪟 **Split View** | Two notebooks side-by-side, one session |
| 📥 **Drag & Drop** | Drop files natively onto the app |
| 🖥️ **Native App** | Frameless window, custom controls |
| 🔐 **Persistent Login** | Stay signed in via secure AppData storage |
| 🔔 **Notifications** | Windows toast on Audio Overview / source / note events |
| 📌 **System Tray** | Minimize-to-tray for quick access |
| 🚀 **Auto-Launch** | Start quietly when Windows boots |
| ☕ **Support** | [Buy Me A Chai](https://buymeachai.ezee.li/GyaneshOnProduct) — UPI supported |

---

## 🗺 Roadmap — v3 and beyond

Help shape the next release. Every item below is a tracked issue — pick one and ship it.

### 🪞 Polish & reliability
- [Webview crash recovery (`render-process-gone`)](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/13) — `good first issue`
- [Visual regression tests for theme + layouts](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/16)

### ⚡ Power-user
- [Workspace / profile switcher (multi-Google-account)](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/11)
- [4+ panes / configurable grid layout](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/12)
- ["What's New" panel on first launch after update](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/14) — `good first issue`

### 🧠 AI-adjacent
- [Programmatic drag-and-drop file upload](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/9) — `help wanted` (hard)
- [Screenshot → OCR → push as source](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/10)

### 🌍 Ecosystem
- [Localization / i18n scaffolding](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/15)
- [Plugin / extension API for community features](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues/17)

See [**all open issues**](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues) · Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

---

## Gallery

![Split view demo 1 — brain-activity research alongside a secondary pane](assets/split-view-1.png)

![Split view demo 2 — connectomics study guide next to a Q3 acceleration briefing](assets/split-view-2.png)

---

## How Notifications Work

The app monitors NotebookLM for completion events through a `webview-preload.js` shim and surfaces a native Windows toast when one fires.

**Detected events:**
- Audio Overview generated
- Source added
- Note saved

---

## Tech Stack

- **[Electron 34](https://www.electronjs.org/)** — desktop runtime
- **[auto-launch](https://www.npmjs.com/package/auto-launch)** — startup integration
- **[electron-updater](https://www.electron.build/auto-update)** — background auto-update channel
- **[electron-builder](https://www.electron.build/)** — NSIS / portable / DMG / AppImage / `.deb` packaging
- **[Playwright](https://playwright.dev/)** — smoke tests for Electron lifecycle and IPC
- **GitHub Actions** — Windows + macOS + Linux build matrix on every tag
- **Vanilla JS / HTML / CSS** — no framework, no bundler, no bloat

---

## For Developers

### Project Structure

```
NotebookLM-for-Windows/
├── assets/
│   ├── icon.png            # App icon
│   ├── split-view-1.png    # Marketing screenshots
│   └── split-view-2.png
├── src/
│   ├── main.js             # Electron main process — windows, hotkey, tray
│   ├── preload.js          # Secure IPC bridge (contextIsolation)
│   ├── renderer.js         # UI logic — title bar, opacity slider, split view
│   ├── webview-preload.js  # In-page hook that detects NotebookLM events
│   └── index.html          # App container
├── PRD/                    # Product specs
├── package.json            # Electron 34 + 2 runtime deps
├── build_installer.bat     # One-click local build
├── CONTRIBUTING.md
└── LICENSE                 # GPL-3.0
```

### Build from Source

```bash
git clone https://github.com/GyaneshSamanta/NotebookLM-for-Windows.git
cd NotebookLM-for-Windows

npm install            # install Electron + builders + Playwright
npm start              # run in dev mode
npm test               # run Playwright smoke tests
npm run dist:win       # Windows: installer + portable .exe
npm run dist:mac       # macOS: .dmg + .zip (run on macOS)
npm run dist:linux     # Linux: AppImage + .deb (run on Linux)
```

Built artifacts land in `dist/` as:
- `NotebookLM-for-Windows-v<version>-Setup.exe` (NSIS installer)
- `NotebookLM-for-Windows-v<version>.exe` (portable)

### Cutting a Release

1. `npm run dist`
2. Repo → **Releases** → **Draft a new release**
3. Create a tag (e.g. `v2.1.0`), upload the `.exe`s from `dist/`, publish.
4. `electron-updater` picks the release up automatically on existing installs.

---

## Contributing

```bash
# 1. Fork on GitHub
git clone https://github.com/<you>/NotebookLM-for-Windows.git
cd NotebookLM-for-Windows
git checkout -b feat/your-feature

# 2. Hack, test
npm install && npm start

# 3. Commit, push, PR
git commit -m "feat: short description"
git push origin feat/your-feature
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

---

## License

[GPL-3.0](LICENSE) © 2026 Gyanesh Samanta.

---

## Contributors

<a href="https://github.com/GyaneshSamanta/NotebookLM-for-Windows/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=GyaneshSamanta/NotebookLM-for-Windows" alt="Contributors" />
</a>

Want to be in this list? Pick a [`good first issue`](https://github.com/GyaneshSamanta/NotebookLM-for-Windows/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and open a PR.

---

## Credits

- **Gyanesh Samanta** — author, maintainer, designer ([LinkedIn](https://www.linkedin.com/in/gyanesh-samanta/) · [@GyaneshSamanta](https://github.com/GyaneshSamanta))
- And **5,000+ downloaders** whose bug reports and feature requests shaped v2.0, v2.1, and v3.0.

<div align="center">
  <p>Built with care for the Windows research community.</p>
</div>
