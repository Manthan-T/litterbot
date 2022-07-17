// Called when the back button is clicked
function back() {
    document.getElementById('detailspage').style.display = 'none'
    document.getElementById('botspage').style.display = 'block'
    window.electronAPI.stopFocusBot()
}

function getData() {
    window.electronAPI.getFocusedBotDetails().then((data) => {
        document.getElementById("name").innerText = data[0]
        document.getElementById("coords").innerText = data[1]
        document.getElementById("destination").innerText = data[2]
    })
}

getData()
setInterval(getData, 1000)