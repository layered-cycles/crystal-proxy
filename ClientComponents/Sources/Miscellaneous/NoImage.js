import React from 'react'
import ReactDOM from 'react-dom'
import '../widget.css'

document.body.style.backgroundColor = 'rgb(246,246,246)'
const displayContainer = document.createElement('div')
document.body.appendChild(displayContainer)
const displayElement = (
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
ReactDOM.render(displayElement, displayContainer)
