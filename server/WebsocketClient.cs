using System.Net.WebSockets;
using System.Threading;
using System.Text;

class WebSocketClient {
    public string ip = "www.thequintuscult.co.uk";
    public int port = 6969;
    
    public GameObject[] bots;


    private ClientWebSocket ws;
    private CancellationTokenSource source;
    private CancellationToken token;

    private bool focusBot;
    private string focusedBot;


    public void Connect() {
        source = new CancellationTokenSource();
        token = source.Token;

        ws = ClientWebSocket();
        ws.ConnectAsync("ws://" + ip + ":" + port, token).Wait();
    }

    public void Receive() {
        var buffer = new ArraySegment<byte>(new byte[100]);
        var result = ws.ReceiveAsync(buffer, token);

        while (!result.EndOfMessage) {
            var message = System.Text.Encoding.UTF8.GetString(buffer.Array).TrimEnd((char) 0);
            var messageParts = message.Split(";");

            switch (messageParts[0])
            {
                case "focusBot":
                    focusBot = true;
                    focusedBot = Array.Find<GameObject>(bots, bot => bot.name == messageParts[1]);
                    break;
                case "unfocusBot":
                    focusBot = false;
            }
        }
    }

    public void Send(string message, bool finalMessage) {
        var byteMessage = Encoding.UTF8.GetBytes(message);

        ws.SendAsync(byteMessage, WebSocketMessageType.Text, finalMessage, token)
    }

    public void SendUpdates() {
        if (!focusBot) {
            foreach (var bot in bots)
            {
                var botScript = bot; // Get the script with bot details
                Send("bot;" + bot.name + ";" + bot.x + "," + bot.y);
            }
        } else {
            Send("info;" + bot.name + ";" + bot.x + "," + bot.y + ";" + bot.destx + "," + bot.desty);
        }
    }

    public void Disconnect() {
        ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Simulation Closing", token);
    }
}