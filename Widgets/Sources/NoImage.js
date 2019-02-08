import React from 'react'
import ReactDOM from 'react-dom'
import './global.css'

// match color of NSWindow.titleBar
document.body.style.backgroundColor = 'rgb(246,246,246)'
const rootContainer = document.createElement('div')
document.body.appendChild(rootContainer)
const rootElement = (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Roboto',
      fontStyle: 'italic',
      fontSize: '16px',
      color: 'rgb(32,32,32)'
    }}
  >
    No Image
  </div>
)
ReactDOM.render(rootElement, rootContainer)
