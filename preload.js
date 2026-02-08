const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),
    getAutoLaunch: () => ipcRenderer.invoke('get-auto-launch'),
    setAutoLaunch: (enable) => ipcRenderer.invoke('set-auto-launch', enable),
    openExternal: (url) => ipcRenderer.send('open-external', url)
});
