// Open bot details page
function openBotDetails(botid) {
    document.getElementById('botspage').style.display = 'none';
    document.getElementById('detailspage').style.display = 'block';
    document.getElementById('botname').textContent = 'Bot Details';
    window.electronAPI.focusBot(botid);
}


// Called when the reload button is clicked
function reload() {
    // Get the bot list and add them to the HTML
    botlist = document.getElementById('botlist');
    botlist.replaceChildren();
    window.electronAPI.getBots().then((bots) => {
        for (const botid in bots) {
            // Create a list element for the bot
            botelement = document.createElement('li');
            botelement.className = 'bot';

            // Add a div for styling to the list element
            botdiv = document.createElement('div');

            botdiv.onclick = () => openBotDetails(botid);

            // Add an image placeholder
            botimg = document.createElement('img')
            botimg.src = 'resources/mapalt.png'

            // Add the bot's coordinates
            bottext = document.createElement('p');
            bottext.textContent = bots[botid];

            // Construct the DOM tree
            botdiv.appendChild(botimg);
            botdiv.appendChild(bottext);
            botelement.appendChild(botdiv);
            botlist.appendChild(botelement);
        }
    })
}