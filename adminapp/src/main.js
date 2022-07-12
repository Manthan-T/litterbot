// Import electron modules
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// The ws library is a simple, easy-to-use websocket client
const WebSocket = require("ws");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1300, // Width
    height: 830, // Height
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script for exposing communication methods
    },
    icon: path.join(__dirname, 'favicon.png'), // Icon
    autoHideMenuBar: true // Don't show "File", "Edit", etc. menus
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};


app.on('window-all-closed', () => {
  app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Handle one-way requests from front app
  ipcMain.on('create-websocket', handleCreateWebsocket)

  // Handle response requests from front app
  ipcMain.handle('server:getBots', handleGetBots)

  // Create window
  createWindow()
});


let botlist = [] // List of bot IDs from server

function handleCreateWebsocket(event, ip, port) {
  // Create the websocket
  ws = new WebSocket('ws://' + ip + ':' + port)

  // Create a handler for all received messages from the server
  ws.on('message', function(data, isBinary) {
    console.log(data.toString())
  })
}

// Handle requests to communicate with server
async function handleGetBots() {

}