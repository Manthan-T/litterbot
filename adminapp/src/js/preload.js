const { contextBridge, ipcRenderer } = require('electron')


// Register communication events between the frontend render process and the backend app process
contextBridge.exposeInMainWorld('electronAPI', {
    createWebsocket: (ip, port) => ipcRenderer.send('create-websocket', ip, port),
    focusBot: (botid) => ipcRenderer.send('focus-bot', ip, port),
    stopFocusBot: () => ipcRenderer.send('stop-focus-bot'),
    getBots: () => ipcRenderer.invoke('server:getBots'),
    getFocusedBotDetails: () => ipcRenderer.invoke('server:getFocusedBotDetails')
})