/* 
 * 
 * Import React, as well as the useEffect and useState hooks. useEffect is called when the Menu component is loaded,
 * and the useState hook is used to store a variables value, despite the nature of React, where value changes are not remembered
 * one the component is reloaded.
 * 
 */
import React, { useState, useEffect } from "react"

// Import the four screens that we made.
import Home from "./screens/Home"
import Login from "./screens/Login"
import Signup from "./screens/Signup"
import Profile from "./screens/Profile"

// The App component, which controls what screen is currently showing.
function App({ toggleLight }) {
    // The current profile being used and a method to change it. By default, the you need to log in.
    const [profile, setProfile] = useState("Log In")
    // The current page being displayed and a method to change it. By default, it is the home page, but if the website is reloaded,
    // it recovers the page reloaded from.
    const [currentPage, setCurrentPage] = useState(`${sessionStorage.getItem("page") === null ? "home" : sessionStorage.getItem("page")}`)
    // Whether day or night mode is on, and a method to change it. By default, it is night mode.
    const [dayMode, setDayMode] = useState(false)
    
    // When the website is loaded, see if someone is logged in, and if so, set the profile to that.
    useEffect(() => {
        if (localStorage.getItem("profile") != null) {
            setProfile(localStorage.getItem("profile"))
        }
    })
    
    // Set the screen to the current page, depending on the value of "currentPage", and also pass some (self-explanatory)
    // arguments to it.
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
        // To avoid compiler errors.
        default:
            break
    }
}

// Allow the App component to be accessed by "index.js".
export default App
