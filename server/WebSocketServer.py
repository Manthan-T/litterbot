import websockets
import asyncio
from threading import Thread


class WebSocketServer(Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.clients = [] # Store all current clients
    
    def broadcast(self, message):
        websockets.broadcast(self.clients, message)

    def run(self):
        asyncio.run(self.main())

    async def handle(self, websocket):
        self.clients.append(websocket)
        async for message in websocket:
            print(f"Recieved {message}")
            await websocket.send(message)

    async def main(self):
        self.server = await websockets.serve(self.handle, "localhost", 42069)
        await self.server.start_serving()
        await self.server.wait_closed()

websocket_thread = WebSocketServer(name="Websocket Thread", daemon=True)
# This thread is started in Server.py