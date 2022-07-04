import React, { useState, useEffect } from "react"

import Home from "./screens/Home"
import Login from "./screens/Login"
import Signup from "./screens/Signup"
import Profile from "./screens/Profile"

function App() {
    const [profile, setProfile] = useState("Log In")
    const [currentPage, setCurrentPage] = useState("home")
    const [nightMode, setNightMode] = useState(true)
    
    useEffect(() => {
        if (localStorage.getItem("profile") != null) {
            setProfile(localStorage.getItem("profile"))
        }
    })
    
    switch (currentPage) {
        case "home":
            return (<Home onProfileClick = {setCurrentPage} profile = {profile} nightMode = {nightMode} setNightMode = {setNightMode}/>)
        case "login":
            return (<Login onBackClick = {() => setCurrentPage("home")} onSignUpClick = {() => setCurrentPage("signup")} setProfile = {setProfile}/>)
        case "signup":
            return (<Signup onBackClick = {() => setCurrentPage("login")}/>)
        case "profile":
            return (<Profile onBackClick = {() => setCurrentPage("home")} onLogout = {() => {
                localStorage.removeItem("profile")
                setProfile("Log In")
            }} username = {profile}/>)
        default:
            break
    }
}

export default App
