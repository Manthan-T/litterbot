# Import the servers
import WebServer as ws
import WebSocketServer as wss
import SimulationWebsocketServer as swss

# Provide the websocketserver and the simulationwebsocketserver with each other so they can communicate
wss.websocket_thread.swss = swss.websocket_thread
swss.websocket_thread.wss = wss.websocket_thread

# Start webserver (for communication with website)
ws.flask_thread.start()

# Start websocket server (for communication with admin app)
wss.websocket_thread.start()

# Start simulation websocket server (for communication with simulation)
swss.websocket_thread.start()

try:
    input() # Close everything if enter is pressed
except KeyboardInterrupt: # Close everything if Ctrl+C is pressed
    pass

wss.websocket_thread.server.close()
swss.websocket_thread.server.close()
print("Exited Successfully!")