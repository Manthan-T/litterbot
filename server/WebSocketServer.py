import websockets
import asyncio
from threading import Thread


class WebSocketServer(Thread):
    def __init__(self):
        Thread.__init__(self, name="Websocket Thread", daemon=True)
        self.server = None # Replaced by the server so it can be closed by main thread

    def run(self):
        asyncio.run(self.main())

    async def echo(self, websocket):
        async for message in websocket:
            await websocket.send(message)

    async def main(self):
        self.server = await websockets.serve(self.echo, "localhost", 42069)
        await self.server.start_serving()
        await self.server.wait_closed()

websocket_thread = WebSocketServer()
# This thread is started in Server.py