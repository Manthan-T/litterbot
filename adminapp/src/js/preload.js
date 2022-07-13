const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    createWebsocket: (ip, port) => ipcRenderer.send('create-websocket', ip, port),
    getBots: () => ipcRenderer.invoke('server:getBots')
})