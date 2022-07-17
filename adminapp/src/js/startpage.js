// Code for the electron app itself (Renderer Process)

// Called when the start button is clicked
function start() {
    // Connect to server
    window.electronAPI.createWebsocket('localhost', 42069);

    // Hide the start page and show the bots page
    document.getElementById('startpage').style.display = 'none';
    document.getElementById('botspage').style.display = 'block';

    // Reload the bots page
    reload()
}