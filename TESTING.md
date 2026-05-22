# TESTING.md — Release Smoke Checklist

Run this before tagging any `v*` release. Automated Playwright smokes cover lifecycle and IPC; this checklist covers behavior that the harness can't see.

## Setup

- `npm install`
- `npm test` — all Playwright smokes pass.

## Windows

### Fresh install
- [ ] `npm run dist:win` produces both `NotebookLM-for-Windows-v<ver>-Setup.exe` and `NotebookLM-for-Windows-v<ver>.exe` in `dist/`.
- [ ] Installer runs without warnings (other than unsigned publisher), creates desktop + Start Menu shortcuts.
- [ ] Portable `.exe` launches without touching registry (verify with `regedit` snapshot, optional).

### Upgrade
- [ ] Install over a v2.1 build. Persistent login (Google session) survives.
- [ ] `ui-config.json` migrates into `settings.json` on first launch (verify `%APPDATA%/NotebookLM-for-Windows/settings.json` exists, `opacity` matches old value).

### Core features
- [ ] **Opacity slider** — moves between 20%–100%; persists across restart.
- [ ] **Pin / always-on-top** — title bar pin button toggles. Window stays above other apps.
- [ ] **Theme** — title bar theme button cycles system → light → dark → system. Body `data-theme` flips immediately.
- [ ] **Panes** — cycles 1 / 2 / 3. Each pane loads NotebookLM, shares login session.
- [ ] **Settings modal** — opens via gear icon and via tray "Settings". Closes via Close button and backdrop click.
- [ ] **Hotkey rebind** — capture field accepts a new combo (e.g. `Ctrl+Alt+M`), persists across restart, original `Ctrl+Alt+N` no longer fires.
- [ ] **Quick-Clip (main visible)** — copy text from another app, press hotkey → focuses main window, pastes into the *focused* pane (not always pane 1).
- [ ] **Quick-Clip overlay (main hidden)** — minimize the window, press hotkey → overlay appears near cursor with preview. Enter clips, Esc cancels, click-away dismisses.
- [ ] **Notes export** — press ⬇ Export with a notebook open → save dialog → `.md` file contains `# Title` and at least one `## Note` section.
  - If selectors are stale, notification "Could not find notes" fires — file an issue, do **not** block release.
- [ ] **URL drop** — drag a `https://…` link from a browser onto the window → either auto-populates the "Add URL" field in NotebookLM, or a "URL copied" toast appears.
- [ ] **File drop** — drag a PDF onto the window. NotebookLM's native dropzone accepts it (current behavior; programmatic injection still an open issue).
- [ ] **Tray** — left-click toggles show/hide. Right-click menu has Show / Settings / Quit. Settings option opens the modal.
- [ ] **Auto-launch** — footer checkbox toggles. Setting persists.
- [ ] **Webview retry overlay** — disable WiFi, reload → "Couldn't reach NotebookLM" overlay shows. Retry button reloads.
- [ ] **Auto-updater** — does NOT prompt to install beta when running stable (`allowPrerelease: false` is set).

## macOS

- [ ] `npm run dist:mac` produces `.dmg` and `.zip`.
- [ ] DMG opens, app drags to Applications, launches (Gatekeeper warning expected — unsigned).
- [ ] Hotkey works with `Cmd+Alt+N` style accelerator.
- [ ] Cmd+Q quits; Cmd+W hides (window-close hides to tray on Win/Linux, on Mac the dock icon remains).
- [ ] Theme follows system when `theme = system`.

## Linux (Ubuntu 24.04 recommended)

- [ ] `npm run dist:linux` produces `.AppImage` and `.deb`.
- [ ] AppImage runs after `chmod +x`.
- [ ] `.deb` installs via `sudo dpkg -i …`, app appears in Activities.
- [ ] Tray icon visible (may require GNOME extension on stock GNOME).
- [ ] Global hotkey registers and fires.

## Beta gate

- [ ] Tag `v3.0.0-beta.X` → CI matrix green on all three OSes → assets attached to a **prerelease**.
- [ ] Existing v2.1 installs do NOT auto-update to the beta (verify by leaving a v2.1 install running for 1 hour after publishing).
- [ ] At least 7 days with zero P0/P1 issues filed against the beta tag.

## Stable gate

- [ ] Tag `v3.0.0` → CI publishes stable release.
- [ ] An existing v2.1 install auto-updates within ~24 hours.
- [ ] README badges show v3.0.0 and updated download counter.
