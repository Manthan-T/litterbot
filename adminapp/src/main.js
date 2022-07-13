// Import electron modules
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { electron } = require('process');

// The ws library is a simple, easy-to-use websocket client
const WebSocket = require('ws');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1300, // Width
    height: 830, // Height
    webPreferences: {
      preload: path.join(__dirname, 'js/preload.js'), // Preload script for exposing communication methods
    },
    icon: path.join(__dirname, 'resources/favicon.png'), // Icon
    autoHideMenuBar: true // Don't show 'File', 'Edit', etc. menus
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
  ipcMain.on('create-websocket', handleCreateWebsocket);

  // Handle response requests from front app
  ipcMain.handle('server:getBots', handleGetBots);

  // Create window
  createWindow();
});


let botlist = {
  1: [27, 36],
  2: [41, 21]
} // List of bot locations from server

function handleCreateWebsocket(event, ip, port) {
  // Create the websocket
  ws = new WebSocket('ws://' + ip + ':' + port);

  // Create a handler for all received messages from the server
  ws.on('message', function(data, isBinary) {
    // Messages are formatted in parts separated by ; e.g. 'botlist ; 1,18,27 ; 2,36,21'
    // This example represents two robots at coordinates (18,27) and (36,21) with IDs 1 and 2
    console.log(data.toString())
    message = data.toString().split(';');

    // Choose a handler based on the message type
    switch (message[0]) {
      case 'botlist': // If a bot list is provided
        // Reset the list
        botlist = {}
        for (const robot of message.slice(1)) {
          // Add each robot's position
          botlist[robot.split(',')[0]] = robot.split(',').slice(1).map((x) => parseInt(x, 10))
        }
        break;
    }
  })
}

// Handle requests to communicate with server
async function handleGetBots() {
  return botlist
}