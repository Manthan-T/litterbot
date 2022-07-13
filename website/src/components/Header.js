// Import React
import React from "react"
// Import some icons to use (for toggling day and night mode)
import { BsFillMoonFill, BsSun } from "react-icons/bs"

// Import the Buttono component
import Button from "./Button"

// A Header component, which receives the following props upon initialisation
const Header = ({ onProfileClick, profile, dayMode, setDayMode }) => {
    // Return the various parts of the Header component wrapped in a div (JSX code in the return statement = HTML code)
    return (
        // The header is contained within a class called "bar" (see "index.css"). It makes the header wide and short, and all
        // components are stored, evenly spaced, in a row
        <div className = "bar">
            {/* If day mode is on, then the sign to click should be a moon (to turn on night mode), and vice versa */}
            {dayMode ?
                <BsFillMoonFill onClick = {setDayMode} size = "30px" cursor = "pointer"/>
            :
                <BsSun onClick = {setDayMode} size = "30px" cursor = "pointer"/>
            }

            {/* The title */}
            <h1 style = {{ fontSize : "65px", marginLeft : "85px" }}>Litterbot Reporting System</h1>
            
            {/*
              *
              * An instance of the button component. Upon clicking, it checks whether the user is logged in (by checking the profile
              * variable has a value or is just "Log In"). The onProfileClick method then sends the user to a login page or the
              * user's profile.
              * 
              */}
            <Button text = {profile} onClick = {() => onProfileClick(`${profile === "Log In" ? "login" : "profile"}`)} dayMode = {dayMode}/>
        </div>
    )
}

// Allow the Header component to be used by another component
export default Header
