# NotebookGLM Desktop

<p align="center">
  <img src="assets/icon.png" alt="NotebookGLM Logo" width="128" height="128">
</p>

<p align="center">
  <strong>A native Windows desktop app for Google NotebookLM</strong>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-for-developers">For Developers</a>
</p>

---

## 🚀 Quick Start

### Download & Run (No Installation Required!)

1. **Download** the latest release from the [**Releases Page**](../../releases).
2. **Extract** the ZIP file to any folder.
3. **Run** `NotebookGLM.exe` inside the extracted folder.

That's it! No installation, no setup wizards. Just run and enjoy.

> **Tip:** Pin `NotebookGLM.exe` to your taskbar for quick access!

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ **Native Window** | NotebookLM in its own dedicated window, separate from your browser |
| � **Persistent Login** | Stay signed in - your Google session persists across app restarts |
| �🔔 **Smart Notifications** | Get Windows toast notifications when audio generation completes |
| 📌 **System Tray** | Minimize to tray, keeps running in the background |
| 🚀 **Auto-Launch** | Optional: Start automatically when Windows boots |
| 🎨 **Custom Branding** | Sleek dark footer with quick settings |

---

## 🔔 How Notifications Work

The app monitors the NotebookLM web page for completion events (like "Audio Overview generated"). When detected, it triggers a native Windows notification so you can work on other things while waiting.

**Detected Events:**
- Audio Overview generated
- Source added
- Note saved

---

## 💻 For Developers

### Project Structure

```
NotebookLM-for-Windows/
├── assets/
│   └── icon.png           # App icon (256x256)
├── main.js                 # Electron main process
├── preload.js              # Secure bridge for IPC
├── renderer.js             # UI logic
├── webview-preload.js      # Injected into NotebookLM for notifications
├── index.html              # App container
├── package.json            # Dependencies & scripts
├── build_installer.bat     # One-click build script
└── README.md               # This file
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

# Build portable app
npx electron-packager . NotebookGLM --platform=win32 --arch=x64 --out=setup --overwrite
```

The built app will be in `setup/NotebookGLM-win32-x64/`.

### Creating a GitHub Release

1. **Build** the app using the command above.
2. **ZIP** the `setup/NotebookGLM-win32-x64` folder.
3. Go to your repo → **Releases** → **Draft a new release**.
4. Create a new tag (e.g., `v1.0.0`).
5. Upload the ZIP file.
6. Publish the release!

---

## 📜 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ♥ by <a href="https://www.linkedin.com/in/gyanesh-samanta/">Gyanesh Samanta</a>
</p>
