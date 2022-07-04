import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const body = document.body
const toggleLight = () => body.classList.toggle("light-mode")

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App toggleLight = {toggleLight}/>
  </React.StrictMode>
)

reportWebVitals()
