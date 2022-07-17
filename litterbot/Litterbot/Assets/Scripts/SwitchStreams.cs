using System;
using System.Net.WebSockets;
using System.Threading;
using System.Text;

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class SwitchStreams : MonoBehaviour {
    public string ip = "www.thequintuscult.co.uk";
    public int port = 6969;
    
    List<GameObject> bots;

    ClientWebSocket ws;
    CancellationTokenSource source;
    CancellationToken token;

    bool focusBot;
    string focusedBot;


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

            switch (messageParts[0]) {
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

        ws.SendAsync(byteMessage, WebSocketMessageType.Text, finalMessage, token);
    }

    public void SendUpdates() {
        foreach (GameObject bot in bots) {
            Send("bot;" + bot.name + ";" + bot.transform.position.x + "," + bot.transform.position.z);
            Send("info;" + bot.name + ";" + bot.transform.position.x + "," + bot.transform.position.z + ";" + bot.GetComponent<NavMeshAgent>().destination.x + "," + bot.GetComponent<NavMeshAgent>().destination.z);
        }
    }

    public void Disconnect() {
        ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Simulation Closing", token);
    }
    
    void Start() {
        Connect();
    }

    void Update() {
        GameObject[] objecs = UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects();
        foreach (GameObject objec in objecs) {
            if (objec.name.StartsWith("Litterbot") && !bots.Contains(objec)) {
                bots.Add(objec);
            }
        }

        foreach (GameObject bot in bots) {
            if (!objecs.Contains(bot)) {
                bots.Remove(bot);
            }
        }
    }
}
