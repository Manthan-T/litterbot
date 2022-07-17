import React, { useEffect, useState } from "react"

const Timer = ({ actionOnTimeUp, setInstructions, extra, timerNo, profile }) => {
    const [timeLeft, setTimeLeft] = useState("5 minutes left")
    let intTimeLeft = 300

    const prepIntTimeLeft = () => {
        if (timerNo === "1") {
            intTimeLeft = localStorage.getItem("secsLeft" + profile + timerNo) !== null ? localStorage.getItem("secsLeft" + profile + timerNo) - new Date().getSeconds() - localStorage.getItem("secsLeft" + profile + timerNo) : 300
        } else {
            intTimeLeft = intTimeLeft = sessionStorage.getItem("secsLeft" + profile + timerNo) !== null ? sessionStorage.getItem("secsLeft" + profile + timerNo) - new Date().getSeconds() - sessionStorage.getItem("secsLeft" + profile + timerNo) : 300
        }

        if (intTimeLeft <= 0) {
            intTimeLeft = 0
        }

    }

    useEffect(() => {
        prepIntTimeLeft()
        const countdown = setInterval(() => {
            intTimeLeft--
            let mins_left = Math.floor(intTimeLeft / 60)
            let secs_left = intTimeLeft % 60
            setTimeLeft(mins_left + " minute(s) and " + secs_left + " second(s) left" + extra)

            if (intTimeLeft <= 0) {
                actionOnTimeUp()
                clearInterval(countdown)
                setInstructions("You ran out of time. Please leave this page and come back.")
                if (timerNo === "1") {
                    localStorage.setItem("reportCooldown" + profile, false)
                } else {
                    localStorage.removeItem("secsLeft" + profile + timerNo)
                }
            }
        }, 1000)
        return () => clearInterval(countdown)
    }, [actionOnTimeUp])

    /*useEffect(() => {
        window.addEventListener("beforeunload", () => {
            if (timerNo === "1") {
                localStorage.setItem("secsLeft" + profile + timerNo, intTimeLeft)
            } else {
                sessionStorage.setItem("secsLeft" + profile + timerNo, intTimeLeft)
            }
        })
        return () => {
            window.removeEventListener("beforeunload", () => {
                if (timerNo === "1") {
                    localStorage.setItem("secsLeft" + profile + timerNo, intTimeLeft)
                } else {
                    sessionStorage.setItem("secsLeft" + profile + timerNo, intTimeLeft)
                }
            })
        }
    }, [])*/

    return (
        <h2 style = {{ "textAlign" : "center" }}>{timeLeft}</h2>
    )
}

export default Timer