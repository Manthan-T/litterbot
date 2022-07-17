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
   
    const [countDown, setCountDown] = useState(0);
    const [runTimer, setRunTimer] = useState(false);

    useEffect(() => {
        let timerId;

        if (runTimer) {
        setCountDown(60 * 5);
        timerId = setInterval(() => {
            setCountDown((countDown) => countDown - 1);
        }, 1000);
        } else {
            clearInterval(timerId);
        }

        return () => clearInterval(timerId);
    }, [runTimer]);

    useEffect(() => {
        if (countDown < 0 && runTimer) {
            console.log("expired");
            setRunTimer(false);
            setCountDown(0);
        }
    }, [countDown, runTimer]);

    const seconds = String(countDown % 60).padStart(2, 0)
    const minutes = String(Math.floor(countDown / 60)).padStart(2, 0)

    return (
        <h2 style = {{ textAlign : "center" }}>{minutes} {seconds}</h2>
    )
}

// Allow the Timer component to be used by another component
export default Timer