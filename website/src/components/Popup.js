// Import React
import React from "react"
// Import an icon to use (a cross to close the popup)
import { FaTimes } from "react-icons/fa"

// Import a fade in animation
import "../animations/fade.css"

// A Popup component, which returns a div with the class name as the animation, containing a div with a class name that makes it a
// a shadow background, containing a div with a class name that makes it a popup box in either day or night mode, containing a span
// (row) of an "X" and a heading with the provided title. This wrapping of divs is required as an element can only have one component.
// The last div also has content text.
const Popup = ({ title, content, handleClose, animation, dayMode}) => {
    return (
        <div className = {animation}>
            <div className = "background">
                <div className = {`popup-box ${dayMode ? "light-mode" : ""}`}>
                    <span>
                        <FaTimes style = {{ cursor : "pointer", color : "red" }} size = "30px" onClick = {handleClose}/>
                        <h3 style = {{ textAlign : "center", marginTop : "-35px" }}>{title}</h3>
                    </span>
                    {content}
                </div>
            </div>
        </div>
    )
}

// Allow the Popup component to be used by another component
export default Popup