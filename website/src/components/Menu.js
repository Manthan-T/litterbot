/* 
 * 
 * Import React, as well as the useEffect and useState hooks. useEffect is called when the Menu component is loaded,
 * and the useState hook is used to store a variables value, despite the nature of React, where value changes are not remembered
 * one the component is reloaded.
 * 
 */
import React, { useEffect, useState } from "react"

// Import the Button and Timer components.
import Button from "./Button"
import Timer from "./Timer"

// A Menu component, which contains the report button.
const Menu = ({ profile, dayMode }) => {
    // Set report cooldown as false.
    const prepCooldown = () => {
        localStorage.setItem("reportCooldown" + profile, false)
        return false
    }

    // Used to record the position of the user, and a method to change it. By default, there is no position recorded.
    const [position, setPosition] = useState(null)
    // Whether the report cooldown is on or not, a method to toggle it. By default, the value of it is retrieved from local storage and
    // is false if there is no value in local storage.
    const [reportCooldown, setReportCooldown] = useState(localStorage.getItem("reportCooldown" + profile) !== null ? localStorage.getItem("reportCooldown" + profile) : prepCooldown())
    
    // When the Menu component is loaded, check whether local permissions are enabled and alert of this if not.
    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition(setPosition, () => {
            navigator.permissions.query({ name : "geolocation" }).then(result => {
                if (result.state !== "granted") {
                    alert("You cannot submit a report without enabling location permissions")
                }
            })
        })        
    })

    // Return the various parts of the Menu component wrapped in a fragment (which is basically ignored when rendering), as only
    // one element can be returned (JSX code in the return statement = HTML code)
    return (
        <>
            {/* If the person is logged in, make a button and put it in a div with the class container. */}
            {profile !== "Log In" && (
                <>
                    <div className = "container">
                        <div style = {{ marginLeft : "150px" }}>
                            {/*
                              *
                              * A button, which if clicked, check if report cooldown is on. If not, get
                              * the location of the of the person and provide the "setPosition" method
                              * to set the position. If it fails, then check if location permissions are
                              * enabled and if not, alert of this. If the position is properly acquired,
                              * then submit the report to the server and then alert of this, otherwise,
                              * (which shouldn't happen), alert of this. After, set the position to null.
                              * If the report cooldown is on, alert of this.
                              *
                              */}
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

                    {/*
                      *
                      * If the report cooldown is on, show the timer. Give the timer a method on what to do when the timer is up,
                      * method to set instructions (which isn't used with this timer), a suffix for the timer's text, the timer's
                      * number, and the profile currently logged in.
                      *
                      */}
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
