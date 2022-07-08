import React, { useEffect, useState } from "react"

const Timer = ({ actionOnTimeUp, setInstructions, extra, timerNo, profile }) => {
    const formatTime = (secs) => {
        let mins_left = Math.floor(secs / 60)
        let secs_left = secs % 60
        return (mins_left + " minute(s) and " + secs_left + " second(s) left" + extra)
    }

    const setStart = () => {
        localStorage.setItem("secsLeft" + profile + timerNo, 300)
        localStorage.setItem("reportCooldown" + profile + timerNo, true)
        return "5 minutes left"
    }

    const [timeLeft, setTimeLeft] = useState(localStorage.getItem("secsLeft" + profile + timerNo) !== null && !(localStorage.getItem("secsLeft" + profile + timerNo) <= 0) ? formatTime(localStorage.getItem("secsLeft" + profile + timerNo)) : setStart())

    useEffect(() => {
        const countdown = setInterval(() => {
                localStorage.setItem("secsLeft" + profile + timerNo, localStorage.getItem("secsLeft" + profile + timerNo) - 1)
                setTimeLeft(formatTime(localStorage.getItem("secsLeft" + profile + timerNo)))

                if (localStorage.getItem("secsLeft" + profile + timerNo) <= 0) {
                    actionOnTimeUp()
                    clearInterval(countdown)
                    setInstructions("You ran out of time. Please leave this page and come back.")
                    if (timerNo === "2") {
                        localStorage.removeItem("secsLeft" + profile + timerNo)
                    }
                }
        }, 1000)
        return () => clearInterval(countdown)
    }, [actionOnTimeUp])

    return (
        <h2 style = {{ textAlign : "center" }}>{timeLeft}</h2>
    )
}

export default Timer