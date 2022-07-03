import React from "react"

const Button = ({ text, onClick, className, style }) => {
    return (
        <button onClick = {onClick} className = {className} style = {style}>{text}</button>
    )
}

Button.defaultProps = {
   className : "btn" 
}

export default Button
