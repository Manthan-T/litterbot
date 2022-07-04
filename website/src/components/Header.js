import React from "react"
import { BsFillMoonFill, BsSun } from "react-icons/bs"

import Button from "./Button"

const Header = ({ onProfileClick, profile, dayMode, setDayMode }) => {
    return (
        <div className = "bar">
            {dayMode ?
                <BsFillMoonFill onClick = {setDayMode} size = "30px" cursor= "pointer"/>
            :
                <BsSun onClick = {setDayMode} size = "30px" cursor= "pointer"/>
            }
            <h1 style = {{ "fontSize" : "65px", "marginLeft" : "85px" }}>Litterbot Reporting System</h1>
            <Button text = {profile} onClick = {() => onProfileClick(`${profile === "Log In" ? "login" : "profile"}`)} dayMode = {dayMode}/>
        </div>
    )
}

export default Header
