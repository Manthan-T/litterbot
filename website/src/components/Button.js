import React from "react"

const Button = ({ text, onClick, className, style, dayMode }) => {
    return (
        <button onClick = {onClick} className = {`btn ${dayMode ? "light-mode" : ""} ${className}`} style = {style}>{text}</button>
    )
}

export default Button
