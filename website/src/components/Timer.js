/* 
 * 
 * Import React, as well as the useEffect and useState hooks. useEffect is called when the Menu component is loaded,
 * and the useState hook is used to store a variables value, despite the nature of React, where value changes are not remembered
 * one the component is reloaded.
 * 
 */
import React, { useEffect, useState } from "react"

// A Timer component
const Timer = ({ actionOnTimeUp, setInstructions, extra, timerNo, profile }) => {
    // A method to format the time in seconds to minutes and seconds
    const formatTime = (secs) => {
        let mins_left = Math.floor(secs / 60)
        let secs_left = secs % 60
        return (mins_left + " minute(s) and " + secs_left + " second(s) left" + extra)
    }

    // A method to set the start time as 300 seconds and the report cooldown (if it is the report timer) as on when the timer starts
    // It then returns the starting text.
    const setStart = () => {
        localStorage.setItem("secsLeft" + profile + timerNo, 300)
        if (timerNo === "1")
            localStorage.setItem("reportCooldown" + profile, true)
        return "5 minutes left"
    }

    // The time left on the timer and a method to set it.
    const [timeLeft, setTimeLeft] = useState(localStorage.getItem("secsLeft" + profile + timerNo) !== null && !(localStorage.getItem("secsLeft" + profile + timerNo) <= 0) ? formatTime(localStorage.getItem("secsLeft" + profile + timerNo)) : setStart())
    
    useEffect(() => {
        window.addEventListener("beforeunload", () => {

        });
        return () => {
            window.removeEventListener("beforeunload", () => {
                
            });
        };
    }, []);
    
    // Starts the timer when the component is loaded.
    useEffect(() => {
        // A method that is executed every second.
        const countdown = setInterval(() => {
            // Set the tiem left as the time left - 1.
            localStorage.setItem("secsLeft" + profile + timerNo, localStorage.getItem("secsLeft" + profile + timerNo) - 2)
            setTimeLeft(formatTime(localStorage.getItem("secsLeft" + profile + timerNo)))

            // If time is up, do the instructed action and reset the timer.
            if (localStorage.getItem("secsLeft" + profile + timerNo) <= 0) {
                actionOnTimeUp()
                clearInterval(countdown)
                setInstructions("You ran out of time. Please leave this page and come back.")
                if (timerNo === "2") {
                    localStorage.removeItem("secsLeft" + profile + timerNo)
                } else {
                    localStorage.setItem("reportCooldown" + profile, false)
                }
            }
        }, 2000)
        return () => clearInterval(countdown)
    }, [actionOnTimeUp])

    // Return the timer's text
    return (
        <h2 style = {{ textAlign : "center" }}>{timeLeft}</h2>
    )
}

// Allow the Timer component to be used by another component
export default Timer