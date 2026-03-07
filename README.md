# NotebookLM-for-Windows Desktop

<p align="center">
  <img src="assets/icon.png" alt="NotebookLM-for-Windows Logo" width="128" height="128">
</p>

<p align="center">
  <strong>A native Windows desktop app for Google NotebookLM</strong>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-for-developers">For Developers</a>
</p>

<p align="center">
  <a href="https://github.com/GyaneshSamanta/NotebookLM-for-Windows/releases">
    <img src="https://img.shields.io/github/v/release/GyaneshSamanta/NotebookLM-for-Windows?style=for-the-badge&color=3385ff" alt="Latest Release">
  </a>
  <a href="https://github.com/GyaneshSamanta/NotebookLM-for-Windows/releases">
    <img src="https://img.shields.io/github/downloads/GyaneshSamanta/NotebookLM-for-Windows/total?style=for-the-badge&logo=github&color=blue" alt="GitHub downloads">
  </a>
  <a href="https://buymeachai.ezee.li/GyaneshOnProduct">
    <img src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png" alt="Buy Me A Chai" height="28">
  </a>
</p>

> [!NOTE]
> **Thank you for 150+ downloads!** 🚀 I'm incredibly grateful to everyone who has downloaded and used this application. Your support keeps me motivated to keep improving it! 


---

## 🚀 Quick Start

### Download & Run (No Installation Required!)

1. **Download** the latest release from the [**Releases Page**](../../releases).
2. **Extract** the ZIP file to any folder.
3. **Run** `NotebookLM-for-Windows.exe` inside the extracted folder.

That's it! No installation, no setup wizards. Just run and enjoy.

> **Tip:** Pin `NotebookLM-for-Windows.exe` to your taskbar for quick access!

---

> [!WARNING]
> **IMPORTANT: Upgrading to v2.0**
> To access all the exciting new features, you must **download the new v2.0.0 release**. Because of the underlying architecture upgrades for these new features, you will need to **login to your Google account again** upon your first run. Enjoy the new superpowers!

## 🎉 What's New in v2.0 (Major Upgrade)

The v2.0 update transforms this app from a simple web wrapper into a powerful, deeply integrated Windows research utility:

- 👻 **Ghost Mode (Transparency):** Use the new opacity slider in the title bar to make the entire application transparent. Perfect for referencing PDFs, web pages, or videos running underneath NotebookLM!
- ⚡ **Global Quick-Clip (Ctrl+Alt+N):** Found something interesting? Just copy it to your clipboard from any app, press `Ctrl+Alt+N`, and NotebookLM will immediately jump to the foreground and automatically paste it into your active notes.
- 🪟 **Split View:** Why settle for one notebook? Toggle Split View in the title bar to work with two different Notebooks side-by-side in the same window, seamlessly sharing your login session.
- 📥 **Native Drag-and-Drop:** Drag and drop your PDFs, TXT, or Markdown files right onto the app window from your desktop to instantly trigger the upload pipeline.
- 🎨 **Redesigned UI & UX:** Enjoy a brand-new frameless window design with a sleek custom title bar, beautiful Deep Purple gradients, and an updated footer.

---

## ✨ Full Feature List

| Feature | Description |
|---------|-------------|
| 👻 **Ghost Mode** | Custom opacity slider to see through the app window |
| ⚡ **Quick-Clip** | Copy text anywhere -> `Ctrl+Alt+N` -> Instantly paste in NotebookLM |
| 🪟 **Split View** | Work on two different Notebooks simultaneously side-by-side |
| 📥 **Drag & Drop** | Drop files natively onto the app to upload as sources |
| 🖥️ **Native App** | Dedicated, frameless desktop app with custom window controls |
| 🔐 **Persistent Login**| Stay signed in across sessions using secure AppData storage |
| 🔔 **Notifications** | Windows toast notifications when audio generation completes |
| 📌 **System Tray** | Minimize to tray to keep the app readily accessible |
| 🚀 **Auto-Launch** | Configure the app to start quietly when Windows boots |
| ☕ **Support Me** | Support further development with **10 rs** via [Buy Me A Chai](https://buymeachai.ezee.li/GyaneshOnProduct) |

---

## 🔔 How Notifications Work

The app monitors NotebookLM for completion events. When detected, it triggers a native Windows notification so you can work on other things.

**Detected Events:**
- Audio Overview generated
- Source added
- Note saved

---

## 💻 For Developers

### Project Structure

```
NotebookLM-for-Windows/
├── assets/icon.png          # App icon
├── src/
│   ├── main.js              # Electron main process
│   ├── preload.js           # Secure IPC bridge
│   ├── renderer.js          # UI logic
│   ├── webview-preload.js   # Notification detection
│   └── index.html           # App container
├── package.json             # Dependencies & scripts
├── build_installer.bat      # One-click build script
└── README.md
```

### Tech Stack

- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop apps
- **[auto-launch](https://www.npmjs.com/package/auto-launch)** - Windows startup integration
- **Vanilla JS/HTML/CSS** - No framework bloat

### Build from Source

```bash
# Clone the repository
git clone https://github.com/GyaneshSamanta/NotebookLM-for-Windows.git
cd NotebookLM-for-Windows

# Install dependencies
npm install

# Run in development mode
npm start

# Build portable app (one-click)
build_installer.bat

# Or manually:
npm run pack
```

The built app will be in `release/NotebookLM-for-Windows-win32-x64/`.

### Creating a GitHub Release

1. Run `build_installer.bat` or `npm run pack`
2. ZIP the `release/NotebookLM-for-Windows-win32-x64` folder
3. Go to repo → **Releases** → **Draft a new release**
4. Create tag (e.g., `v2.0.0`), upload ZIP, publish!

---

## 📜 License

GPL-3.0 License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ♥ by <a href="https://www.linkedin.com/in/gyanesh-samanta/">Gyanesh Samanta</a>
</p>

<p align="center">
  <a href="https://buymeachai.ezee.li/GyaneshOnProduct">
    <img src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png" alt="Buy Me A Chai" width="200">
  </a>
</p>

<p align="center">
  <em>Supporters can contribute as little as 10 rs! ☕</em>
</p>
