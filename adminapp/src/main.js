// Import electron modules
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { electron, crash } = require('process')

// The ws library is a simple, easy-to-use websocket client
const WebSocket = require('ws')

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
  })

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))
}


app.on('window-all-closed', () => app.quit())

app.on('before-quit', () => ws.close(1000, "App Closing"))

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Handle one-way requests from front app
  ipcMain.on('create-websocket', handleCreateWebsocket)
  ipcMain.on('focus-bot', handleFocusBot)
  ipcMain.on('stop-focus-bot', handleStopFocusBot)

  // Handle response requests from front app
  ipcMain.handle('server:getBots', handleGetBots)
  ipcMain.handle('server:getFocusedBotDetails', handleGetFocusedBotDetails)

  // Create window
  createWindow()
})


var botlist = {} // List of bot locations from server
var focusedBot = undefined
var botdetails = [] // Details of the focused bot
var ws = undefined

function handleCreateWebsocket(event, ip, port) {
  // Create the websocket
    ws = new WebSocket('ws://' + ip + ':' + port)

    // Create a handler for all received messages from the server
    ws.on('message', function(data, isBinary) {
      // Messages are formatted in parts separated by ; e.g. 'botlist;jeremy,18,27;john,36,21'
      // This example represents two robots at coordinates (18,27) and (36,21) with IDs jeremy and john
      message = data.toString().split(';')
      console.log(data.toString())

      // Choose a handler based on the message type
      switch (message[0]) {
        case 'botlist': // If a bot list is provided
          // Reset the list
          botlist = {}
          for (const robot of message.slice(1)) {
            // Add each robot's position
            botlist[robot.split(',')[0]] = robot.split(',').slice(1).map((x) => parseInt(x, 10))
          }
          break
        case 'info':
          // Copy over sent data
          botdetails = message.slice(1)
          break
      }
    })
}

// When a bot is clicked
function handleFocusBot(event, botname) {
  // Tell the server to focus that bot
  ws.send("focusBot;" + botname)
  focusedBot = botname
}

function handleStopFocusBot() {
  // Tell the server to stop focusing
  ws.send("unfocusBot;" + focusedBot)
}



// Handle requests to get details from server
async function handleGetBots() {
  return botlist
}

async function handleGetFocusedBotDetails() {
  return botdetails
}