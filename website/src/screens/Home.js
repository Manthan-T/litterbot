/* 
 * 
 * Import React, as well as the useEffect hook. useEffect is called when the Menu component is loaded.
 * 
 */
import React, { useEffect } from "react"

// Import the Header and Menu components
import Header from "../components/Header"
import Menu from "../components/Menu"

// A Home screen
const Home = ({ onProfileClick, profile, dayMode, setDayMode }) => {
    // When loaded, set this as the current page.
    useEffect(() => {
        sessionStorage.setItem("page", "home")
    })

    // Return the various parts of the Home screen wrapped in a fragment (which is basically ignored when rendering), as only
    // one element can be returned (JSX code in the return statement = HTML code)
    return (
        <>
            {/* A header, title, subtitle, the menu with the report button */}
            <Header onProfileClick = {onProfileClick} profile = {profile} dayMode = {dayMode} setDayMode = {setDayMode}/>
            <h1 style = {{ textAlign : "center" }}>Welcome to the site that cleans up your streets{profile !== "Log In" ? ", " + profile : ""}!</h1>
            <h2 style = {{ textAlign : "center" }}>{profile !== "Log In" ? "If you have seen more litter at your location, please submit a report (you can only do this every 5 minutes)" : "Please log in"}</h2>
            <Menu profile = {profile} dayMode = {dayMode}/>
        </>
    )
}

// Allow the Home screen to be used by "App.js".
export default Home
