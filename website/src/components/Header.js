import React from "react"
import { BsFillMoonFill, BsSun } from "react-icons/bs"

import Button from "./Button"

const Header = ({ onProfileClick, profile, nightMode, setNightMode }) => {
    return (
        <div className = "bar">
            {nightMode ?
                <BsFillMoonFill onClick = {() => setNightMode(false)} size = "30px" cursor= "pointer"/>
            :
                <BsSun onClick = {() => setNightMode(true)} size = "30px" cursor= "pointer"/>
            }
            <h1 style = {{ "fontSize" : "65px", "marginLeft" : "85px" }}>Litterbot Reporting System</h1>
            <Button text = {profile} onClick = {() => onProfileClick(`${profile === "Log In" ? "login" : "profile"}`)}/>
        </div>
    )
}

export default Header
