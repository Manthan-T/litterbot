import React, { useState, useEffect } from "react"

import Home from "./screens/Home"
import Login from "./screens/Login"
import Signup from "./screens/Signup"
import Profile from "./screens/Profile"

function App({ toggleLight }) {
    const [profile, setProfile] = useState("Log In")
    const [currentPage, setCurrentPage] = useState(`${sessionStorage.getItem("page") === null ? "home" : sessionStorage.getItem("page")}`)
    const [dayMode, setDayMode] = useState(false)
    
    useEffect(() => {
        if (localStorage.getItem("profile") != null) {
            setProfile(localStorage.getItem("profile"))
        }
        setCurrentPage(sessionStorage.getItem("page"))
    })
    
    switch (currentPage) {
        case "home":
            return (<Home onProfileClick = {setCurrentPage} profile = {profile} dayMode = {dayMode} setDayMode = {() => {
                setDayMode(!dayMode)
                toggleLight()
            }}/>)
        case "login":
            return (<Login onBackClick = {() => setCurrentPage("home")} onSignUpClick = {() => setCurrentPage("signup")} setProfile = {setProfile} dayMode = {dayMode}/>)
        case "signup":
            return (<Signup onBackClick = {() => setCurrentPage("login")} dayMode = {dayMode}/>)
        case "profile":
            return (<Profile onBackClick = {() => setCurrentPage("home")} onLogout = {() => {
                localStorage.removeItem("profile")
                setProfile("Log In")
            }} username = {profile} dayMode = {dayMode}/>)
        default:
            break
    }
}

export default App
