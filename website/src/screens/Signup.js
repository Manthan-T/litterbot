import React, { useState, useEffect, useCallback } from "react"
import { FaArrowLeft, FaArrowCircleRight } from "react-icons/fa"

import Timer from "../components/Timer"

const Signup = ({ onBackClick, dayMode }) => {
    const [submitLabel, setSubmitLabel] = useState("Sign Up!")
    const [instructions, setInstructions] = useState("Please enter your details to sign up")
    const [verifCode, setVerifCode] = useState("")

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [phoneError, setPhoneError] = useState("")

    const removeUnverifiedUser = useCallback(() => {
        fetch(`/delete_user?username=${username}&password=${password}`)
    }, [username, password])

    useEffect(() => {
        window.addEventListener("beforeunload", removeUnverifiedUser)
        
        return () => {
            window.removeEventListener("beforeunload", removeUnverifiedUser)
        }
    }, [removeUnverifiedUser])

    const onSubmitDetails = (e) => {
        e.preventDefault()

        if (!firstName) {
            alert("Please enter your first name")
            return
        }
        
        if (!lastName) {
            alert("Please enter your last name")
            return
        }
        
        if (!username) {
            alert("Please enter a username")
            return
        }
        
        if (!password) {
            alert("Please enter a password")
            return
        }
        
        if (!email) {
            alert("Please enter your email address")
            return
        }
        
        if (!phoneNumber) {
            alert("Please enter your phone number")
            return
        }
        
        fetch(`/signup?first_name=${firstName}&last_name=${lastName}&username=${username}&password=${password}&email=${email}&phone=${phoneNumber}`)
            .then(res => res.json()).then(data => {
                if (data.response !== "Accepted") {
                    setSubmitLabel("Please try again")

                    switch (data.component) {
                        case "username":
                            setUsernameError(data.response)
                            setPasswordError("")
                            setEmailError("")
                            setPhoneError("")
                            break
                        case "password":
                            setUsernameError("")
                            setPasswordError(data.response)
                            setEmailError("")
                            setPhoneError("")
                            break
                        case "email":
                            setUsernameError("")
                            setPasswordError("")
                            setEmailError(data.response)
                            setPhoneError("")
                            break
                        case "phone":
                            setUsernameError("")
                            setPasswordError("")
                            setEmailError("")
                            setPhoneError(data.response)
                            break
                        default:
                            setUsernameError("")
                            setPasswordError("")
                            setEmailError("")
                            setPhoneError("")
                    }

                } else {
                    setInstructions("Please check your email and enter the 6 digit verification code. You have 5 minutes or until you exit this page.")
                    setSubmitLabel("Check code")
                }
            }
        )
    }

    const onSubmitVerifCode = (e) => {
        e.preventDefault()
        
        fetch(`/signup/verify_code?username=${username}&code=${verifCode}`)
            .then(res => res.json()).then(data => {
                if (!verifCode) {
                    alert("Please enter a code")
                    return
                }

                if (data.response !== "Accepted") {
                    setSubmitLabel("Please try again")
                } else {
                    setInstructions("Your account has been successfully created! Please go back and log in")
                    setSubmitLabel("Check code")
                }
            }
        )
    }
    
    return (
        <>
            <div className = "bar" style = {{ marginTop : "5px" }}>
                <FaArrowLeft onClick = {() => {
                    if (instructions !== "Your account has been successfully created! Please go back and log in") {
                        removeUnverifiedUser()
                    }
                    onBackClick()
                }} size = "35px" cursor = "pointer"/>
                <h1 style = {{ marginLeft : "-20px" }}>{instructions}</h1>
                <p/>
            </div>

            {instructions === "Please enter your details to sign up" ?
                (<form className = "container" onSubmit = {onSubmitDetails}>
                    <div className = "form-control">
                        <label>First name</label>
                        <input type = "text" placeholder = "E.g. Bob" value = {firstName} onChange = {(e) => setFirstName(e.target.value)}/>
                    </div>
                    <div className = "form-control">
                        <label>Last name</label>
                        <input type = "text" placeholder = "E.g. Smith" value = {lastName} onChange = {(e) => setLastName(e.target.value)}/>
                    </div>
                    <div className = "form-control">
                        <label>Username</label>
                        <input type = "text" placeholder = "E.g. verysmart123" value = {username} onChange = {(e) => setUsername(e.target.value)}/>
                        <p>{usernameError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Password</label>
                        <input type = "text" placeholder = "E.g. i3Rk^!$sfP05z" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                        <p>{passwordError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Email address</label>
                        <input type = "text" placeholder = "E.g. bobsmith123@gmail.com" value = {email} onChange = {(e) => setEmail(e.target.value)}/>
                        <p>{emailError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Phone number</label>
                        <input type = "text" placeholder = "E.g. 07962534676" value = {phoneNumber} onChange = {(e) => setPhoneNumber(e.target.value)}/>
                        <p>{phoneError}</p>
                    </div>

                    <input type = "submit" value = {submitLabel} className = {`btn btn-block ${dayMode ? "light-mode": ""}`} style = {{ cursor : "pointer" }}/>
                </form>
            ) : (
                <form className = "container" onSubmit = {onSubmitVerifCode}>
                    {(instructions !== "You ran out of time. Please leave this page and come back." && instructions !== "Your account has been successfully created! Please go back and log in") &&
                        (<>
                            <div className = "form-control">
                                <Timer actionOnTimeUp = {removeUnverifiedUser} setInstructions = {setInstructions} extra = ""/>
                                <label>6 digit verification code</label>
                                <input type = "text" placeholder = "000000" value = {verifCode} onChange = {(e) => setVerifCode(e.target.value)}/>
                            </div>

                            <h4 style = {{ textAlign : "center" }}>Didn't get an email? Click here to resend it:</h4>
                            <FaArrowCircleRight size = "25px" style = {{ marginLeft : "50%" }} cursor = "pointer" onClick = {() => fetch(`/signup/resend_email?name=${firstName}&username=${username}&email=${email}`)}/>
                            
                            <input type = "submit" value = {submitLabel} className = {`btn btn-block ${dayMode ? "light-mode": ""}`} style = {{ cursor : "pointer" }}/>
                        </>)}
                </form>
            )}
        </>
    )
}

export default Signup
