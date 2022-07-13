// Code for the electron app itself (Renderer Process)

// When the app is started properly
document.getElementById('startbtn').onclick = function() {
    // Connect to server
    window.electronAPI.createWebsocket('localhost', 42069);

    // Hide the start page and show the bots page
    document.getElementById('startpage').style.display = 'none';
    document.getElementById('botspage').style.display = 'block';
}   

// When the reload button is pressed
document.getElementById('reloadbtn').onclick = function() {
    // Get the bot list and add them to the HTML
    botlist = document.getElementById('botlist');
    botlist.replaceChildren();
    window.electronAPI.getBots().then((bots) => {
        for (const bot in bots) {
            botelement = document.createElement('li');
            botelement.className = 'bot';
            botdiv = document.createElement('div');
            botimg = document.createElement('img')
            botimg.src = 'resources/mapalt.png'
            bottext = document.createElement('p');
            bottext.textContent = bots[bot];
            botdiv.appendChild(botimg);
            botdiv.appendChild(bottext);
            botelement.appendChild(botdiv);
            botlist.appendChild(botelement);
        }
    })
}