import React, { useEffect, useState } from "react"

const Timer = ({ actionOnTimeUp, setInstructions }) => {
    
    const [timeLeft, setTimeLeft] = useState("5 minutes left")

    useEffect(() => {
        let intTimeLeft = 300
        const countdown = setInterval(() => {
            intTimeLeft--
            let mins_left = Math.floor(intTimeLeft / 60)
            let secs_left = intTimeLeft % 60
            setTimeLeft(mins_left + " minute(s) and " + secs_left + " second(s) left")

            if (intTimeLeft === 0) {
                actionOnTimeUp()
                clearInterval(countdown)
                setInstructions("You ran out of time. Please leave this page and come back.")
            }
        }, 1000)
        return () => clearInterval(countdown)
    }, [actionOnTimeUp])

    return (
        <h2 style = {{ "textAlign" : "center" }}>{timeLeft}</h2>
    )
}

export default Timer
