// Code for the electron app itself (Renderer Process)

document.getElementById("startbtn").onclick = function() {
    window.electronAPI.createWebsocket("localhost", 42069)
    document.getElementById("startpage").style.display = 'none'
    document.getElementById("botspage").style.display = 'block'
}   