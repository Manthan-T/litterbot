/* 
 * 
 * Import React, as well as the useEffect and useState hooks. useEffect is called when the Menu component is loaded,
 * and the useState hook is used to store a variables value, despite the nature of React, where value changes are not remembered
 * one the component is reloaded.
 * 
 */
import React, { useState, useEffect } from "react"

// Import some icons for use as a back arrow and to hide and show the password.
import { FaArrowLeft, FaEye } from "react-icons/fa"

// Import the Button and Popup components.
import Button from "../components/Button"
import Popup from "../components/Popup"

// A Profile screen
const Profile = ({ onBackClick, onLogout, username, dayMode }) => {
    // Information contained in a profile and a method to change it (to display them).
    const [profile, setProfile] = useState([])
    // The password on display and a method to change what is displayed.
    const [password, setPassword] = useState("")
    // The potential error message for the password and a method to set it.
    const [passwordError, setPasswordError] = useState("")
    // Whether the password is shown or not and a method to toggle it. It is false by default.
    const [passwordShown, setPasswordShown] = useState(false)
    // Whether the delete account is open or not and a method to toggle it. It is false by default.
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);

    // The delete account button's text and a method to change it.
    const [deleteButton, setDeleteButton] = useState("Delete Account");
    // The password inputted in the delete popup and a method to set it (based on what is inputted in the form).
    const [pwdInput, setPwdInput] = useState("");

    // When loaded, set this as the current page. Also, fetch the profile data and display it.
    // Format the password to be only asterisks.
    useEffect(() => {
        sessionStorage.setItem("page", "profile")
        fetch(`/get_profile?username=${username}`).then(res => res.json()).then(data => {
            setProfile(...data.profile)
            setPassword("Password: " + data.profile[0][3].slice(10).replace(/./g, "*"))
        })
    }, [username])

    // A method to toggle the password's visibility.
    const toggle_password = () => {
        if (passwordShown) {
            setPassword("Password: " + profile[3].slice(10).replace(/./g, "*"))
        } else {
            setPassword(profile[3])
        }
        setPasswordShown(!passwordShown)
    }
    
    // What to do on submitting the delete account form.
    const onSubmit = (e) => {
        // Prevent the default action on submitting the form.
        e.preventDefault()

        // Give an error message if no password is provided and return.
        if (!pwdInput) {
            setPasswordError("Please enter your password")
            return
        }

        // Request the password to be deleted.
        fetch(`/delete_account?username=${username}&password=${pwdInput}`).then(res => res.json()).then(data => {
            // If the response is "Done", the account has been deleted, so logout, go back, clear any password errors,
            // and remove the profile from local storage.
            if (data.response === "Done") {
                onLogout()
                onBackClick()
                setPasswordError("")
                localStorage.removeItem("secsLeft" + profile)
            // If not, the password must be incorrect and therefore give an error message.
            } else {
                setPasswordError("Incorrect password")
            }
        })
    }

    // Return the various parts of the Profile screen wrapped in a fragment (which is basically ignored when rendering), as only
    // one element can be returned (JSX code in the return statement = HTML code)
    return (
        <>
            {/* A div containing a back arrow, a title, and a log out button in a row. */}
            <div className = "bar" style = {{ marginTop : "5px" }}>
                <FaArrowLeft onClick = {onBackClick} size = "35px" cursor = "pointer"/>
                <h1 style = {{ marginLeft : "3%" }}>Your Profile:</h1>
                <Button text = "Log Out" onClick = {() => {
                    onLogout()
                    onBackClick()
                }} dayMode = {dayMode}/>
            </div>

            {/* A div in the form of a container, with all of the profile information. */}
            <div className = "container">
                {profile.map((property) => (
                    <h4 style = {{textAlign : "center"}}>{property.slice(0, 8) === "Password" ? password : property} {property.slice(0, 8) === "Password" && <FaEye style = {{ "cursor" : "pointer" }} size = "20px" onClick = {toggle_password}/>}</h4>
                ))}
            </div>

            {/* Make a button to delete the account. */}
            <Button className = "btn-block" style = {{ maxWidth : "30%", marginLeft : "35%", marginBottom : "15px" }} text = "Delete Account" onClick = {() => setDeletePopupOpen(!deletePopupOpen)} dayMode = {dayMode}/>
            {/* If the popup is open, show it, with a form requesting the password to confirm deletion, as well as what to do when the popup is closed. */}
            {deletePopupOpen && (
                <Popup title = "Are you sure you want to delete your account?" animation = "fade-in"
                    content = {
                        <form className = "container" onSubmit = {onSubmit}>
                            <div className = "form-control">
                                <label>Password</label>
                                <input type = "text" placeholder = "Your Password" value = {pwdInput} onChange = {(e) => setPwdInput(e.target.value)}/>
                                <p>{passwordError}</p>
                            </div>

                            <input type = "submit" value = {deleteButton} className = {`btn btn-block ${dayMode ? "light-mode": ""}`} style = {{ cursor : "pointer" }}/>
                        </form>
                    }
                    handleClose = {() => {
                        setDeleteButton("Delete Account")
                        setPwdInput("")
                        setDeletePopupOpen(!deletePopupOpen)
                    }}
                    dayMode = {dayMode}
                    >
                </Popup>
            )}

            {/* A footer of sorts. */}
            <h4 style = {{ textAlign : "center", marginTop : "100px" }}>We are dedicated to keeping the streets of London and the UK clean.</h4>
            <h4 style = {{ textAlign : "center" }}>Please contact us at thequintuscult@gmail.com for support, or for help to set up a Litterbot army for your own streets!</h4>
        </>
    )
}

// Allow the Profile screen to be used by "App.js".
export default Profile
