import React from "react"

import Button from "./Button"

const Header = ({ onProfileClick, profile }) => {

    return (
        <div className = "bar">
            <p/>
            <h1 style = {{ "fontSize" : "65px", "marginLeft" : "90px" }}>Litterbot Reporting System</h1>
            <Button text = {profile} onClick = {() => onProfileClick(`${profile === "Log In" ? "login" : "profile"}`)}/>
        </div>
    )
}

export default Header
