import asyncio

# Import and start the backend server
import WebServer as ws
import WebSocketServer as wss

# Start webserver (for communication with website)
ws.flask_thread.start()

# Start websocket server (for communication with admin app)
wss.websocket_thread.start()

try:
    input("") # Close everything if enter is pressed
except KeyboardInterrupt: # Close everything if Ctrl+C is pressed
    pass

wss.websocket_thread.server.close()
print("Exited Successfully!")