// Open bot details page
function openBotDetails(botname) {
    document.getElementById('botspage').style.display = 'none';
    document.getElementById('detailspage').style.display = 'block';
    document.getElementById('botname').textContent = 'Bot Details';
    window.electronAPI.focusBot(botname);
}


// Called when the reload button is clicked
function reload() {
    // Get the bot list and add them to the HTML
    botlist = document.getElementById('botlist');
    console.log(botlist)
    botlist.replaceChildren();
    window.electronAPI.getBots().then((bots) => {
        for (const botname in bots) {
            // Create a list element for the bot
            botelement = document.createElement('li');

            // Add a div for styling to the list element
            botdiv = document.createElement('div');

            botdiv.onclick = () => openBotDetails(botname);

            // Add an image placeholder
            botimg = document.createElement('img')
            botimg.src = 'resources/boticon.png'

            // Add the bot's coordinates
            bottext = document.createElement('p');
            bottext.textContent = botname + ' at (' + bots[botname] + ')';

            // Construct the DOM tree
            botdiv.appendChild(botimg);
            botdiv.appendChild(bottext);
            botelement.appendChild(botdiv);
            botlist.appendChild(botelement);
        }
    })
}

window.setInterval(reload, 10000) // Reload automatically every 30 seconds