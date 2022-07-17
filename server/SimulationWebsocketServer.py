import websockets
import asyncio
from threading import Thread

class WebSocketServer(Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.clients = [] # Store all current clients
        self.wss = None # Store the websocket thread
    
    def broadcast(self, message):
        websockets.broadcast(self.clients, message)

    def run(self):
        asyncio.run(self.main())

    async def handle(self, websocket):
        self.clients.append(websocket)
        async for message in websocket:
            print("SWS: " + message)
            message = message.split(";") # Messages are formatted with each component split by semicolons, starting with the message type
            # If this message is about the bot list
            if message[0] == "bot":
                # Store the provided bot's coordinates
                self.wss.bots[message[1]] = message[2]
            # If this message is about a focused bot
            elif message[0] == "info":
                # Store the details
                self.wss.focused_bot_details[message[1]] = tuple(message[2:]) # Lists are unhashable

    async def main(self):
        self.server = await websockets.serve(self.handle, "0.0.0.0", 6969)
        await self.server.start_serving()
        await self.server.wait_closed()

websocket_thread = WebSocketServer(name="Simulation Websocket Thread", daemon=True)
# This thread is started in Server.py