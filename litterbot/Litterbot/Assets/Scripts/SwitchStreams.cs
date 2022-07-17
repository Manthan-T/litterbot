/*using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Text;

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class SwitchStreams : MonoBehaviour {
    // IP and port of the server
    // Stores all alive bots
    List<GameObject> bots;

    // Objects required for instantiating the websocket
    ClientWebSocket ws;
    CancellationTokenSource source;
    CancellationToken token;

    // A list of all the given app-focused bots
    List<string> focusedBots;
    
    public void Connect() {
        // Create a cancellation token for the async methods
        source = new CancellationTokenSource();
        token = source.Token;

        // Create and connect the websocket
        ws = new ClientWebSocket();
        ws.ConnectAsync(new System.Uri("ws://www.thequintuscult.co.uk:6969"), token).Wait();
    }

    public void Receive() {
        Task<WebSocketReceiveResult> receiveTask;
        // Repeat until all messages have been processed
        do {
            // Create a buffer to recieve messages in
            var buffer = new ArraySegment<byte>(new byte[100]);

            // Pull a message from the server
            receiveTask = ws.ReceiveAsync(buffer, token);
            receiveTask.Wait();

            // Convert message to text and trim empty characters
            var message = System.Text.Encoding.UTF8.GetString(buffer.Array).TrimEnd((char) 0);

            // Split message by delimiter
            var messageParts = message.Split(";");


            switch (messageParts[0]) {
                // Either add or remove a bot from the focused array
                case "focusBot":
                    focusedBots.AddRange(Array.Find<GameObject>(bots, bot => bot.name == messageParts[1]));
                    break;
                case "unfocusBot":
                    focusedBots.RemoveRange(Array.Find<GameObject>(bots, bot => bot.name == messageParts[1]));
                    break;
            }
            // If there is another message, process it as well
        } while (!receiveTask.result.EndOfMessage);
    }

    public void Send(string message, bool finalMessage) {
        // Convert message to bytes
        var byteMessage = Encoding.UTF8.GetBytes(message);

        // Send the message
        ws.SendAsync(byteMessage, WebSocketMessageType.Text, finalMessage, token);
    }

    public void SendUpdates() {
        // Send general info for all bots
        foreach (GameObject bot in bots) {
            Send("bot;" + bot.name + ";" + bot.transform.position.x + "," + bot.transform.position.z, false);
        }

        // Send specific info for focused bots
        foreach (GameObject bot in focusedBots) {
            Send("info;" + bot.name + ";" + bot.transform.position.x + "," + bot.transform.position.z + ";" + bot.GetComponent<NavMeshAgent>().destination.x + "," + bot.GetComponent<NavMeshAgent>().destination.z, focusedBots.IndexOf(bot) == focusedBots.Length - 1 ? true : false);
        }
    }

    public void Disconnect() {
        // Close the connection
        ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Simulation Closing", token);
    }
    

    // Unity methods
    void Start() {
        // Connect to the websocket on start
        Connect();
    }

    void Update() {
        // Get all game objects
        GameObject[] objecs = UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects();

        // Add all bot objects that are not already added to the bots list
        bots.AddRange(Array.FindAll<GameObject>(objecs, objec => (objec.name.StartsWith("Litterbot") && !bots.Contains(objec))));

        // For each bot that is no longer in the objects list
        foreach (GameObject bot in bots) {
            if (!objecs.Contains(bot)) {
                // Remove it from the bots list
                bots.Remove(bot);
            }
        }

        // Do the updates
        SendUpdates();
        Receive();
    }
}
*/