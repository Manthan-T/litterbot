import React from "react"
import { FaTimes } from "react-icons/fa"

import "../animations/fade.css"

const Popup = ({ title, content, handleClose, animation}) => {
    return (
        <div className = {animation}>
            <div className = "background">
                <div className = "popup-box">
                    <span>
                        <FaTimes style = {{ "cursor" : "pointer", "color" : "red" }} size = "30px" onClick = {handleClose}/>
                        <h3 style = {{ "textAlign" : "center", "marginTop" : "-35px" }}>{title}</h3>
                    </span>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default Popup