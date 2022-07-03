import React from "react"

import Header from "../components/Header"
import Menu from "../components/Menu"

const Home = ({ onProfileClick, profile }) => {
    return (
        <>
            <Header onProfileClick = {onProfileClick} profile = {profile}/>
            <h1 style = {{ "textAlign" : "center" }}>Welcome to the site that cleans up your streets{profile !== "Log In" ? " " + profile : ""}!</h1>
            <h2 style = {{ "textAlign" : "center" }}>{profile !== "Log In" ? "If you have seen more litter at your location, please submit a report (you can only do this every 5 minutes)" : "Please log in"}</h2>
            <Menu profile = {profile}/>
        </>
    )
}

export default Home
