import React, { useState, useEffect, useCallback } from "react"
import { FaArrowLeft, FaArrowCircleRight, FaAsterisk } from "react-icons/fa"

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

    const [firstNameError, setFirstNameError] = useState("")
    const [lastNameError, setLastNameError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [codeError, setCodeError] = useState("")

    const [verifMode, setVerifMode] = useState(false)

    const removeUnverifiedUser = useCallback(() => {
        fetch(`/delete_user?username=${username}&password=${password}`)
    }, [username, password])

    useEffect(() => {
        sessionStorage.setItem("page", "signup")
    })

    const onSubmitDetails = (e) => {
        e.preventDefault()

        if (!firstName) {
            setFirstNameError("Please enter your first name")
            setLastNameError("")
            setUsernameError("")
            setPasswordError("")
            setConfirmPasswordError("")
            setEmailError("")
            setPhoneError("")
            return
        }
        
        if (!lastName) {
            setFirstNameError("")
            setLastNameError("Please enter your last name")
            setUsernameError("")
            setPasswordError("")
            setConfirmPasswordError("")
            setEmailError("")
            setPhoneError("")
            return
        }
        
        if (!username) {
            setFirstNameError("")
            setLastNameError("")
            setUsernameError("Please enter a username")
            setPasswordError("")
            setConfirmPasswordError("")
            setEmailError("")
            setPhoneError("")
            return
        }
        
        if (!password) {
            setFirstNameError("")
            setLastNameError("")
            setUsernameError("")
            setPasswordError("Please enter a password")
            setConfirmPasswordError("")
            setEmailError("")
            setPhoneError("")
            return
        }

        if (!(password.match(/[A-Z]/g) && password.match(/[a-z]/g) && password.match(/[0-9]/g) && password.match(/[!()[\].?_-`~@#$^&*=+£]/g))) {
            setFirstNameError("")
            setLastNameError("")
            setUsernameError("")
            setPasswordError("Passwords must contain upper and lowercase letters, numbers, and the at least one of the symbols:\n"
                           + "!()[].?_-`~@#$^&*=+£\n"
                           + "Please try another password.")
            setConfirmPasswordError("")
            setEmailError("")
            setPhoneError("")
            return
        }

        if (!confirmPassword) {
            setFirstNameError("")
            setLastNameError("")
            setUsernameError("")
            setPasswordError("")
            setConfirmPasswordError("Please confirm your password")
            setEmailError("")
            setPhoneError("")
            return
        }

        if (confirmPassword !== password) {
            setFirstNameError("")
            setLastNameError("")
            setUsernameError("")
            setPasswordError("")
            setConfirmPasswordError("This does not match your password")
            setEmailError("")
            setPhoneError("")
            return
        }
        
        if (!email) {
            setFirstNameError("")
            setLastNameError("")
            setUsernameError("")
            setPasswordError("")
            setConfirmPasswordError("")
            setEmailError("Please enter your email address")
            setPhoneError("")
            return
        }
        
        if (!phoneNumber) {
            setFirstNameError("")
            setLastNameError("")
            setUsernameError("")
            setPasswordError("")
            setConfirmPasswordError("")
            setEmailError("")
            setPhoneError("Please enter your phone number")
            return
        }
        
        fetch(`/signup?first_name=${firstName}&last_name=${lastName}&username=${username}&password=${password}&email=${email}&phone=${phoneNumber}`)
            .then(res => res.json()).then(data => {
                if (data.response !== "Accepted") {
                    switch (data.component) {
                        case "username":
                            setFirstNameError("")
                            setLastNameError("")
                            setUsernameError(data.response)
                            setPasswordError("")
                            setConfirmPasswordError("")
                            setEmailError("")
                            setPhoneError("")
                            break
                        case "password":
                            setFirstNameError("")
                            setLastNameError("")
                            setUsernameError("")
                            setPasswordError(data.response)
                            setConfirmPasswordError("")
                            setEmailError("")
                            setPhoneError("")
                            break
                        case "email":
                            setFirstNameError("")
                            setLastNameError("")
                            setUsernameError("")
                            setPasswordError("")
                            setConfirmPasswordError("")
                            setEmailError(data.response)
                            setPhoneError("")
                            break
                        case "phone":
                            setFirstNameError("")
                            setLastNameError("")
                            setUsernameError("")
                            setPasswordError("")
                            setConfirmPasswordError("")
                            setEmailError("")
                            setPhoneError(data.response)
                            break
                        default:
                            setFirstNameError("")
                            setLastNameError("")
                            setUsernameError("")
                            setPasswordError("")
                            setConfirmPasswordError("")
                            setEmailError("")
                            setPhoneError("")
                    }

                } else {
                    setFirstNameError("")
                    setLastNameError("")
                    setUsernameError("")
                    setPasswordError("")
                    setConfirmPasswordError("")
                    setEmailError("")
                    setPhoneError("")
                    setInstructions("Please check your email and enter the 6 digit verification code. You have 5 minutes or until you exit this page.")
                    setSubmitLabel("Check code")
                    setVerifMode(true)
                }
            }
        )
    }

    const onSubmitVerifCode = (e) => {
        e.preventDefault()
        
        fetch(`/signup/verify_code?username=${username}&code=${verifCode}`)
            .then(res => res.json()).then(data => {
                if (!verifCode) {
                    setCodeError("Please enter a code")
                    return
                }

                if (data.response !== "Accepted") {
                    setCodeError("Incorrect code")
                } else {
                    setCodeError("")
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
                        removeUnverifiedUser()
                        setVerifMode(false)
                        onBackClick()
                }} size = "35px" cursor = "pointer"/>
                <h1 style = {{ marginLeft : "-20px" }}>{instructions}</h1>
                <p/>
            </div>

            {!verifMode ?
                (<form className = "container" onSubmit = {onSubmitDetails}>
                    <div className = "form-control">
                        <label>First name <FaAsterisk color = "#E02828" size = "7.5px" style = {{ marginBottom : "7.5px" }}/></label>
                        <input type = "text" placeholder = "E.g. Bob" value = {firstName} onChange = {(e) => setFirstName(e.target.value)}/>
                        <p>{firstNameError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Last name <FaAsterisk color = "#E02828" size = "7.5px" style = {{ marginBottom : "7.5px" }}/></label>
                        <input type = "text" placeholder = "E.g. Smith" value = {lastName} onChange = {(e) => setLastName(e.target.value)}/>
                        <p>{lastNameError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Username <FaAsterisk color = "#E02828" size = "7.5px" style = {{ marginBottom : "7.5px" }}/></label>
                        <input type = "text" placeholder = "E.g. verysmart123" value = {username} onChange = {(e) => setUsername(e.target.value)}/>
                        <p>{usernameError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Password <FaAsterisk color = "#E02828" size = "7.5px" style = {{ marginBottom : "7.5px" }}/></label>
                        <input type = "password" placeholder = "E.g. i3Rk^!$sfP05z" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                        <p>{passwordError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Confirm Password <FaAsterisk color = "#E02828" size = "7.5px" style = {{ marginBottom : "7.5px" }}/></label>
                        <input type = "password" placeholder = "E.g. i3Rk^!$sfP05z" value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)}/>
                        <p>{confirmPasswordError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Email address <FaAsterisk color = "#E02828" size = "7.5px" style = {{ marginBottom : "7.5px" }}/></label>
                        <input type = "text" placeholder = "E.g. bobsmith123@gmail.com" value = {email} onChange = {(e) => setEmail(e.target.value)}/>
                        <p>{emailError}</p>
                    </div>
                    <div className = "form-control">
                        <label>Phone number <FaAsterisk color = "#E02828" size = "7.5px" style = {{ marginBottom : "7.5px" }}/></label>
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
                                <Timer actionOnTimeUp = {removeUnverifiedUser} setInstructions = {setInstructions} extra = "" timerNo = "2"/>
                                <label>6 digit verification code</label>
                                <input type = "text" placeholder = "000000" value = {verifCode} onChange = {(e) => setVerifCode(e.target.value)}/>
                                <p>{codeError}</p>
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
