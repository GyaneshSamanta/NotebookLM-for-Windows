const { app, BrowserWindow, Tray, Menu, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const AutoLaunch = require('auto-launch');

let mainWindow;
let tray;
let isQuitting = false;

// Auto-launch configuration
const appLauncher = new AutoLaunch({
    name: 'NotebookGLM',
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets', 'icon.png'), // Will need to convert SVG or use PNG if available
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            nodeIntegration: false,
            contextIsolation: true
        },
        autoHideMenuBar: true,
    });

    mainWindow.loadFile('index.html');

    // Close to tray behavior
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    // Open external links in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });
}

function createTray() {
    // Ideally use a .ico for Windows tray, falling back to png/svg
    const iconPath = path.join(__dirname, 'assets', 'icon.png'); 
    tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Show App', 
            click: () => mainWindow.show() 
        },
        { 
            label: 'Quit', 
            click: () => {
                isQuitting = true;
                app.quit();
            } 
        }
    ]);

    tray.setToolTip('NotebookGLM');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    // Check auto-launch status
    appLauncher.isEnabled().then((isEnabled) => {
        if (!isEnabled) appLauncher.enable();
    }).catch((err) => {
        console.error('Auto-launch error:', err);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
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
