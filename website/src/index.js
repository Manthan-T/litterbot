// Import React and the ReactDOM, which represents the React app as a logical tree (albeit in this case it only has one component).
import React from 'react'
import ReactDOM from 'react-dom/client'

// Import "index.css"
import './index.css'
// Import the App component
import App from './App'
// Import a method to log debugging information when any changes made to the site are saved (during development)
import reportWebVitals from './reportWebVitals'

// Get the body from "index.html"
const body = document.body
// Create a method to toggle day/lightmode for the background, by toggling a class in the body's CSS.
const toggleLight = () => body.classList.toggle("light-mode")

// Get the root of the document.
const root = ReactDOM.createRoot(document.getElementById('root'))
// Render the React app in strict mode, which again helps with debugging.
root.render(
  <React.StrictMode>
    <App toggleLight = {toggleLight}/>
  </React.StrictMode>
)

// Use the method from the import on line 10 (see how it works there).
reportWebVitals()
