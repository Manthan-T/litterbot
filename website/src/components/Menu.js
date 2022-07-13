import React, { useEffect, useState } from "react"

import Button from "./Button"
import Timer from "./Timer"

const Menu = ({ profile, dayMode }) => {
    const prepCooldown = () => {
        localStorage.setItem("reportCooldown" + profile, false)
        return false
    }

    const [position, setPosition] = useState(null)
    const [reportCooldown, setReportCooldown] = useState(localStorage.getItem("reportCooldown" + profile) !== null ? localStorage.getItem("reportCooldown" + profile) : prepCooldown())
    
    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition(setPosition, () => {
            navigator.permissions.query({ name : "geolocation" }).then(result => {
                if (result.state !== "granted") {
                    alert("You cannot submit a report without enabling location permissions")
                }
            })
        })        
    })

    return (
        <>
            {profile !== "Log In" && (
                <>
                    <div className = "container">
                        <div style = {{ marginLeft : "150px" }}>
                            <Button text = "Submit Report" onClick = {() => {
                                if (!reportCooldown) {
                                    window.navigator.geolocation.getCurrentPosition(setPosition, () => {
                                        navigator.permissions.query({ name : "geolocation" }).then(result => {
                                            if (result.state !== "granted") {
                                                alert("You cannot submit a report without enabling location permissions")
                                            }
                                        })
                                    })
                                        
                                    if (position !== null) {
                                        fetch(`/submit_report?username=${profile}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`)
                                            .then(res => res.json()).then(() => {
                                                alert("Thank you for your report")
                                                setReportCooldown(true)
                                            }
                                        )
                                    } else {
                                        alert("An error occurred. Please press the button again.")
                                    }

                                    setPosition(null)
                                } else {
                                    alert("You cannot send a report until the timer is up")
                                }
                            }} dayMode = {dayMode}/>
                        </div>
                    </div>
                    
                    {reportCooldown && (
                        <Timer actionOnTimeUp = {() => {
                            setReportCooldown(false)
                            localStorage.setItem("reportCooldown" + profile, false)
                        }} setInstructions = {(string) => {string = "i'm useless"}} extra = " on the report cooldown" timerNo = "1" profile = {profile}/>
                    )}
                </>
            )}
        </>
    )
}

// Allow the Menu component to be used by another component
export default Menu
