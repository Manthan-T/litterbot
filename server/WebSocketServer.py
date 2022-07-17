from asyncio.base_subprocess import WriteSubprocessPipeProto
from websockets import serve, broadcast, ConnectionClosedOK 
import asyncio
from threading import Thread

class WebSocketServer(Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.clients = {} # Store all current clients and whether they are focused or not
        self.swss = None # Store the simulation web socket server

        # Details about all bots
        self.bots = {"jeremy": "1,3", "john": "2,6"}

        # The focused bot details
        self.focused_bot_details = {"jeremy": ("1,3", "5,7"), "john": ("5,7", "23,62")}
    
    def broadcast(self, message):   
        broadcast(self.clients, message)

    def run(self):
        asyncio.run(self.main())

    async def handle(self, websocket):
        print("Connection opened to client!")
        # Store the client
        self.clients[websocket] = False

        # Don't crash when the connection is closed
        # When a message is received
        async for message in websocket:
            # Log it
            print("WS: " + message)

            # Store whether to send the app focused or general data
            if message.startswith("focusBot"):
                self.clients[websocket] = message.split(";")[1]
            elif message.startswith("unfocusBot"):
                self.clients[websocket] = False

            self.swss.broadcast(message) # Pass on all messages to the simulation
        del self.clients[websocket]
        print("Connection closed to client!")

    async def main(self):
        # Schedule sending data to all clients
        asyncio.create_task(self.send_data())

        # Start the server
        self.server = await serve(self.handle, "0.0.0.0", 42069)
        await self.server.start_serving()
        await self.server.wait_closed()
    
    async def send_data(self):
        # Repeatedly send bot data to app
        while True:
            print(self.clients)
            # Prepare botlist message
            botmessage = "botlist;"
            for name in self.bots:
                # Add details of the bot
                botmessage += name + ","
                botmessage += self.bots[name]
                botmessage += ";"
            botmessage = botmessage.rstrip(";") # Remove extra ;

            # For each connected app
            try:
                for client in self.clients:
                    # Send the data type that the client wants
                    try:
                        # Either send the general data...
                        try:
                            await client.send(botmessage if self.clients[client] == False else \
                                                "info;" + (";".join(self.focused_bot_details[self.clients[client]]))) # ...or send the requested specific data
                        except KeyError:
                            pass # This is thrown if a bot was focused but no focus data exists yet
                    except ConnectionClosedOK:
                        pass # This is thrown iff this client was closed but has not yet been removed.
                    
                await asyncio.sleep(1) # Repeat every second
            except RuntimeError:
                pass # This is thrown if the dictionary size changes during the loop i.e. the client disconnects
                


websocket_thread = WebSocketServer(name="Websocket Thread", daemon=True)
# This thread is started in Server.py