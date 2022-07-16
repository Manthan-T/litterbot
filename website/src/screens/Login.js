/* 
 * 
 * Import React, as well as the useEffect and useState hooks. useEffect is called when the Menu component is loaded,
 * and the useState hook is used to store a variables value, despite the nature of React, where value changes are not remembered
 * one the component is reloaded.
 * 
 */
import React, { useState, useEffect } from "react"

// Import an icon to use as a back arrow.
import { FaArrowLeft } from "react-icons/fa"

// Import the Button component.
import Button from "../components/Button"

// A Login screen
const Login = ({ onBackClick, onSignUpClick, setProfile, dayMode }) => {
    // The text of the submit label and a method to set it.
    const [submitLabel, setSubmitLabel] = useState("Log In")

    // The inputted username and password and methods to set them.
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    
    // The potential errors for the username and password and methods to set them.
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    // When loaded, set this as the current page.
    useEffect(() => {
        sessionStorage.setItem("page", "login")
    })

    // What to do on submitting the delete account form.
    const onSubmit = (e) => {
        // Prevent the default action on submitting the form.
        e.preventDefault()

        // Give an error message if no username or password is provided and return.
        if (!username) {
            setUsernameError("Please enter a username")
            return
        }
        
        if (!password) {
            setPasswordError("Please enter a password")
            return
        }

        // Request login access
        fetch(`/login?username=${username}&password=${password}`).then(res => res.json()).then(data => {
            // If access is not granted, give an error message.
            if (data.access !== "granted") {
                setSubmitLabel("The username or password is incorrect\nPlease try again")
            // Otherwise, set the current profile to the one approved and go to the home screen.
            } else {
                setProfile(username)
                localStorage.setItem("profile", username)
                onBackClick()
            }
        })
    }

    // Return the various parts of the Profile screen wrapped in a fragment (which is basically ignored when rendering), as only
    // one element can be returned (JSX code in the return statement = HTML code)
    return (
        <>
            {/* A back arrow, a title, and the sign up button in a row. */}
            <div className = "bar" style = {{ marginTop : "2px" }}>
                <FaArrowLeft onClick = {onBackClick} size = "35px" cursor = "pointer"/>
                <h1 style = {{ marginLeft : "230px" }}>Please enter your username and password</h1>
                <Button text = {"Don't have an account?"} onClick = {onSignUpClick} dayMode = {dayMode}/>
            </div>

            {/* A form to input login information. */}
            <form className = "container" onSubmit = {onSubmit}>
                <div className = "form-control">
                    <label>Username</label>
                    <input type = "text" placeholder = "Username" value = {username} onChange = {(e) => setUsername(e.target.value)}/>
                    <p>{usernameError}</p>
                </div>
                <div className = "form-control">
                    <label>Password</label>
                    <input type = "password" placeholder = "Password" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                    <p>{passwordError}</p>
                </div>

                <input type = "submit" value = {submitLabel} className = {`btn btn-block ${dayMode ? "light-mode": ""}`} style = {{ cursor : "pointer" }}/>
            </form>
        </>
    )
}

// Allow the Login screen to be used by "App.js".
export default Login
