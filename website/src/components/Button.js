// Import React
import React from "react"

// A Button component, which receives the following props upon initialisation
const Button = ({ text, onClick, className, style, dayMode }) => {
    // Return the actual button (JSX code in the return statement = HTML code)
    return (
        <button onClick = {onClick} className = {`btn ${dayMode ? "light-mode" : ""} ${className}`} style = {style}>{text}</button>
    )
}

// Allow the Button component to be used by another component
export default Button
