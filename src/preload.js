const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),
    getAutoLaunch: () => ipcRenderer.invoke('get-auto-launch'),
    setAutoLaunch: (enable) => ipcRenderer.invoke('set-auto-launch', enable),
    openExternal: (url) => ipcRenderer.send('open-external', url),
    
    // Window controls
    windowAction: (action) => ipcRenderer.send('window-controls', action),
    
    // Opacity
    setOpacity: (value) => ipcRenderer.send('set-opacity', value),
    getOpacity: () => ipcRenderer.invoke('get-opacity'),

    // Listeners
    onQuickClip: (callback) => ipcRenderer.on('quick-clip', (event, text) => callback(text))
});
