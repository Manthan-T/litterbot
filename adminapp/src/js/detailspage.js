// Called when the back button is clicked
function back() {
    document.getElementById('detailspage').style.display = 'none';
    document.getElementById('botspage').style.display = 'block';
    window.electronAPI.stopFocusBot();
}

function getData() {
    window.electronAPI.getFocusedBotData().then((data) => {
        document.getElementById("name").innerText = data.name;
        document.getElementById("botid").innerText = data.botid;
        document.getElementById("uptime").innerText = data.uptime;
        document.getElementById("litter").innerText = data.litter;
        document.getElementById("coordinates").innerText = data.coordinates;
        document.getElementById("destination").innerText = data.coordinates;
    })
}