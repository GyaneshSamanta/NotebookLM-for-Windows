const {
    app, BrowserWindow, Tray, Menu, ipcMain, shell, Notification, session,
    globalShortcut, clipboard, nativeTheme, dialog, screen
} = require('electron');
const path = require('path');
const fs = require('fs');
const AutoLaunch = require('auto-launch');
const { autoUpdater } = require('electron-updater');
const settings = require('./settings');

app.setName('NotebookLM-for-Windows');

const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

let mainWindow;
let quickClipOverlay;
let tray;
let isQuitting = false;
let currentAccelerator = null;

const appLauncher = new AutoLaunch({ name: 'NotebookLM-for-Windows' });

function createWindow() {
    const initialOpacity = settings.get('opacity');
    const alwaysOnTop = settings.get('alwaysOnTop');

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        transparent: false,
        icon: path.join(__dirname, '../assets', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        alwaysOnTop: !!alwaysOnTop,
    });

    if (typeof initialOpacity === 'number') {
        mainWindow.setOpacity(initialOpacity);
    }

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    // Push initial theme to renderer once loaded
    mainWindow.webContents.on('did-finish-load', () => {
        sendThemeToRenderer();
    });
}

function createTray() {
    const iconPath = path.join(__dirname, '../assets', 'icon.png');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => mainWindow && mainWindow.show() },
        { label: 'Settings', click: () => {
            if (mainWindow) {
                mainWindow.show();
                mainWindow.webContents.send('open-settings');
            }
        }},
        { type: 'separator' },
        { label: 'Quit', click: () => { isQuitting = true; app.quit(); } },
    ]);

    tray.setToolTip('NotebookLM-for-Windows');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (!mainWindow) return;
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}

function createApplicationMenu() {
    if (!isMac) {
        Menu.setApplicationMenu(null);
        return;
    }
    const template = [
        {
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' },
            ],
        },
        { role: 'editMenu' },
        { role: 'viewMenu' },
        { role: 'windowMenu' },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function registerQuickClip(accelerator) {
    if (currentAccelerator) {
        try { globalShortcut.unregister(currentAccelerator); } catch (e) {}
    }
    const ok = globalShortcut.register(accelerator, onQuickClipFired);
    if (ok) {
        currentAccelerator = accelerator;
        return true;
    }
    // Fallback to default if the new accelerator failed
    if (accelerator !== settings.DEFAULTS.quickClipAccelerator) {
        const fallback = settings.DEFAULTS.quickClipAccelerator;
        const okFallback = globalShortcut.register(fallback, onQuickClipFired);
        if (okFallback) {
            currentAccelerator = fallback;
            settings.set('quickClipAccelerator', fallback);
        }
    }
    return false;
}

function onQuickClipFired() {
    const text = clipboard.readText();

    // If main window is hidden or minimized, show the mini overlay near cursor.
    if (mainWindow && (!mainWindow.isVisible() || mainWindow.isMinimized())) {
        showQuickClipOverlay(text);
        return;
    }

    if (mainWindow) {
        mainWindow.focus();
        if (text) mainWindow.webContents.send('quick-clip', text);
    }
}

function showQuickClipOverlay(text) {
    const cursor = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursor);
    const width = 420;
    const height = 140;
    const x = Math.min(Math.max(cursor.x - width / 2, display.workArea.x + 10),
        display.workArea.x + display.workArea.width - width - 10);
    const y = Math.min(Math.max(cursor.y - height - 20, display.workArea.y + 10),
        display.workArea.y + display.workArea.height - height - 10);

    if (quickClipOverlay && !quickClipOverlay.isDestroyed()) {
        quickClipOverlay.setBounds({ x, y, width, height });
        quickClipOverlay.show();
        quickClipOverlay.webContents.send('quick-clip-text', text);
        quickClipOverlay.focus();
        return;
    }

    quickClipOverlay = new BrowserWindow({
        width, height, x, y,
        frame: false,
        resizable: false,
        movable: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        show: false,
        transparent: true,
        hasShadow: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    quickClipOverlay.loadFile(path.join(__dirname, 'quick-clip-overlay.html'));
    quickClipOverlay.once('ready-to-show', () => {
        quickClipOverlay.show();
        quickClipOverlay.webContents.send('quick-clip-text', text);
    });
    quickClipOverlay.on('blur', () => {
        if (quickClipOverlay && !quickClipOverlay.isDestroyed()) quickClipOverlay.hide();
    });
}

function sendThemeToRenderer() {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    const themePref = settings.get('theme');
    const resolved = themePref === 'system'
        ? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
        : themePref;
    mainWindow.webContents.send('theme-changed', resolved);
}

app.whenReady().then(() => {
    settings.init();

    try {
        session.fromPartition('persist:notebooklm', { cache: true });
    } catch (err) {
        console.error('Session config error:', err);
    }

    createApplicationMenu();
    createWindow();
    createTray();

    if (isMac) {
        try { app.dock.setIcon(path.join(__dirname, '../assets', 'icon.png')); } catch (e) {}
    }

    // Auto-launch follows settings
    appLauncher.isEnabled().then((isEnabled) => {
        const want = settings.get('autoLaunch');
        if (want && !isEnabled) appLauncher.enable();
        if (!want && isEnabled) appLauncher.disable();
    }).catch((err) => console.error('Auto-launch error:', err));

    registerQuickClip(settings.get('quickClipAccelerator'));

    nativeTheme.on('updated', sendThemeToRenderer);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    autoUpdater.allowPrerelease = false;
    autoUpdater.checkForUpdatesAndNotify();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (isMac) {
        // mac convention: stay in dock
        return;
    }
    // Windows/Linux: keep running for tray
});

// ---------- IPC ----------

ipcMain.on('window-controls', (event, action) => {
    if (!mainWindow) return;
    switch (action) {
        case 'minimize': mainWindow.minimize(); break;
        case 'maximize':
            mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
            break;
        case 'close': mainWindow.close(); break;
    }
});

ipcMain.on('set-opacity', (event, value) => {
    if (mainWindow) {
        mainWindow.setOpacity(value);
        settings.set('opacity', value);
    }
});

ipcMain.handle('get-opacity', () => settings.get('opacity'));

ipcMain.on('show-notification', (event, { title, body }) => {
    new Notification({ title, body }).show();
});

ipcMain.on('open-external', (event, url) => shell.openExternal(url));

ipcMain.handle('get-auto-launch', async () => {
    return await appLauncher.isEnabled();
});

ipcMain.handle('set-auto-launch', async (event, enable) => {
    if (enable) await appLauncher.enable(); else await appLauncher.disable();
    settings.set('autoLaunch', !!enable);
    return enable;
});

// Settings IPC
ipcMain.handle('settings:get-all', () => settings.getAll());
ipcMain.handle('settings:set', (event, key, value) => {
    settings.set(key, value);
    return settings.get(key);
});

// Always-on-top
ipcMain.handle('set-always-on-top', (event, value) => {
    settings.set('alwaysOnTop', !!value);
    if (mainWindow) mainWindow.setAlwaysOnTop(!!value);
    return !!value;
});
ipcMain.handle('get-always-on-top', () => settings.get('alwaysOnTop'));

// Hotkey rebind
ipcMain.handle('set-hotkey', (event, accelerator) => {
    if (typeof accelerator !== 'string' || !accelerator.trim()) {
        return { ok: false, current: currentAccelerator };
    }
    const ok = registerQuickClip(accelerator);
    if (ok) settings.set('quickClipAccelerator', accelerator);
    return { ok, current: currentAccelerator };
});

// Theme
ipcMain.handle('set-theme', (event, value) => {
    if (!['light', 'dark', 'system'].includes(value)) return settings.get('theme');
    settings.set('theme', value);
    sendThemeToRenderer();
    return value;
});

// Notes export
ipcMain.handle('notes:save-markdown', async (event, { filename, content }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Export notes',
        defaultPath: filename || 'notebooklm-notes.md',
        filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (result.canceled || !result.filePath) return { ok: false };
    try {
        fs.writeFileSync(result.filePath, content, 'utf8');
        return { ok: true, filePath: result.filePath };
    } catch (e) {
        return { ok: false, error: e.message };
    }
});

// Quick-clip overlay
ipcMain.on('quick-clip:confirm', (event, text) => {
    if (quickClipOverlay && !quickClipOverlay.isDestroyed()) quickClipOverlay.hide();
    if (mainWindow) {
        if (!mainWindow.isVisible()) mainWindow.show();
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        if (text) mainWindow.webContents.send('quick-clip', text);
    }
});

ipcMain.on('quick-clip:cancel', () => {
    if (quickClipOverlay && !quickClipOverlay.isDestroyed()) quickClipOverlay.hide();
});

// Auto-updater notifications
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on('update-available', () => {
    new Notification({
        title: 'Update Available',
        body: 'A new version of NotebookLM-for-Windows is available. It will be downloaded in the background.',
    }).show();
});

autoUpdater.on('update-downloaded', () => {
    new Notification({
        title: 'Update Ready',
        body: 'The new version has been downloaded and will be installed when you restart the app.',
    }).show();
});
