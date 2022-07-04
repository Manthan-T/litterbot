import React, { useState, useEffect } from "react"
import { FaArrowLeft, FaEye } from "react-icons/fa"

import Button from "../components/Button"
import Popup from "../components/Popup"

const Profile = ({ onBackClick, onLogout, username, dayMode }) => {
    const [profile, setProfile] = useState([])
    const [password, setPassword] = useState("")
    const [passwordShown, setPasswordShown] = useState(false)
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [deleteButton, setDeleteButton] = useState("Delete Account");
    const [pwdInput, setPwdInput] = useState("");

    useEffect(() => {
        fetch(`/get_profile?username=${username}`).then(res => res.json()).then(data => {
            setProfile(...data.profile)
            setPassword("Password: " + data.profile[0][3].slice(10).replace(/./g, "*"))
        })
    }, [username])

    const toggle_password = () => {
        if (passwordShown) {
            setPassword("Password: " + profile[3].slice(10).replace(/./g, "*"))
        } else {
            setPassword(profile[3])
        }
        setPasswordShown(!passwordShown)
    }
    
    const onSubmit = (e) => {
        e.preventDefault()

        if (!pwdInput) {
            alert("Please enter your password")
            return
        }

        fetch(`/delete_account?username=${username}&password=${pwdInput}`).then(res => res.json()).then(data => {
            if (data.response === "Done") {
                onLogout()
                onBackClick()
            } else {
                setDeleteButton("Incorrect password")
            }
        })
    }

    return (
        <>
            <div className = "bar" style = {{ "marginTop" : "5px" }}>
                <FaArrowLeft onClick = {onBackClick} size = "35px" cursor = "pointer"/>
                <h1 style = {{ "marginLeft" : "3%" }}>Your Profile:</h1>
                <Button text = "Log Out" onClick = {() => {
                    onLogout()
                    onBackClick()
                }} dayMode = {dayMode}/>
            </div>
            <div className = "container">
                {profile.map((property) => (
                    <h4 style = {{"textAlign" : "center"}}>{property.slice(0, 8) === "Password" ? password : property} {property.slice(0, 8) === "Password" && <FaEye style = {{ "cursor" : "pointer" }} size = "20px" onClick = {toggle_password}/>}</h4>
                ))}
            </div>

            <Button className = "btn-block" style = {{ "maxWidth" : "30%", "marginLeft" : "35%", "marginBottom" : "15px" }} text = "Delete Account" onClick = {() => setDeletePopupOpen(!deletePopupOpen)} dayMode = {dayMode}/>
            {deletePopupOpen && (
                <Popup title = "Are you sure you want to delete your account?" animation = "fade-in"
                    content = {
                        <form className = "container" onSubmit = {onSubmit}>
                            <div className = "form-control">
                                <label>Password</label>
                                <input type = "text" placeholder = "Your Password" value = {pwdInput} onChange = {(e) => setPwdInput(e.target.value)}/>
                            </div>

                            <input type = "submit" value = {deleteButton} className = {`btn btn-block ${dayMode ? "light-mode": ""}`} style = {{"cursor" : "pointer"}}/>
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

            <h4 style = {{ "textAlign" : "center", "marginTop" : "100px" }}>We are dedicated to keeping the streets of London and the UK clean.</h4>
            <h4 style = {{ "textAlign" : "center" }}>Please contact us at thequintuscult@gmail.com for support, or for help to set up a Litterbot army for your own streets!</h4>
        </>
    )
}

export default Profile
