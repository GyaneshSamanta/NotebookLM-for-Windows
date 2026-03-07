const { app, BrowserWindow, Tray, Menu, ipcMain, shell, Notification, session, globalShortcut, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const AutoLaunch = require('auto-launch');

app.setName('NotebookLM-for-Windows');

let mainWindow;
let tray;
let isQuitting = false;

// Auto-launch config
const appLauncher = new AutoLaunch({
    name: 'NotebookLM-for-Windows',
});

// Config storage for Ghost Mode Opacity
const configPath = path.join(app.getPath('userData'), 'ui-config.json');

function loadConfig() {
    try {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading config', e);
    }
    return { opacity: 1.0 }; // default
}

function saveConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config));
    } catch (e) {
        console.error('Error saving config', e);
    }
}

let appConfig = loadConfig();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false, // Custom title bar
        transparent: false,
        icon: path.join(__dirname, '../assets', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            nodeIntegration: false,
            contextIsolation: true
        },
        autoHideMenuBar: true,
    });

    if (appConfig.opacity) {
        mainWindow.setOpacity(appConfig.opacity);
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
}

function createTray() {
    const iconPath = path.join(__dirname, '../assets', 'icon.png'); 
    tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => mainWindow.show() },
        { label: 'Quit', click: () => {
            isQuitting = true;
            app.quit();
        }}
    ]);

    tray.setToolTip('NotebookLM-for-Windows');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}

app.whenReady().then(() => {
    try {
        const persistentSession = session.fromPartition('persist:notebooklm', {
            cache: true
        });
    } catch (err) {
        console.error('Session config error:', err);
    }

    createWindow();
    createTray();

    appLauncher.isEnabled().then((isEnabled) => {
        if (!isEnabled) appLauncher.enable();
    }).catch((err) => {
        console.error('Auto-launch error:', err);
    });

    // Register Global Quick-Clip shortcut
    globalShortcut.register('CommandOrControl+Alt+N', () => {
        if (mainWindow) {
            if (!mainWindow.isVisible()) {
                mainWindow.show();
            }
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
            
            // Get clipboard text
            const text = clipboard.readText();
            if (text) {
                mainWindow.webContents.send('quick-clip', text);
            }
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// IPC for UI controls
ipcMain.on('window-controls', (event, action) => {
    if (!mainWindow) return;
    switch (action) {
        case 'minimize':
            mainWindow.minimize();
            break;
        case 'maximize':
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
            break;
        case 'close':
            mainWindow.close();
            break;
    }
});

ipcMain.on('set-opacity', (event, value) => {
    if (mainWindow) {
        mainWindow.setOpacity(value);
        appConfig.opacity = value;
        saveConfig(appConfig);
    }
});

ipcMain.handle('get-opacity', () => {
    return appConfig.opacity || 1.0;
});

// IPC for Notifications
ipcMain.on('show-notification', (event, { title, body }) => {
    new Notification({ title, body }).show();
});

ipcMain.on('open-external', (event, url) => {
    shell.openExternal(url);
});

// IPC for Auto-Launch Toggle
ipcMain.handle('get-auto-launch', async () => {
    return await appLauncher.isEnabled();
});

ipcMain.handle('set-auto-launch', async (event, enable) => {
    if (enable) {
        await appLauncher.enable();
    } else {
        await appLauncher.disable();
    }
    return enable;
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // We don't quit here because we have a tray
    }
});
