const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    createWebsocket: (ip, port) => ipcRenderer.send('create-websocket', ip, port),
    focusBot: (botid) => ipcRenderer.invoke('focus-bot', ip, port),
    stopFocusBot: () => ipcRenderer.invoke('stop-focus-bot'),
    getBots: () => ipcRenderer.invoke('server:getBots'),
    getFocusedBotDetails: () => ipcRenderer.invoke('server:getFocusedBotDetails')
})