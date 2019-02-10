import React from 'react'
import ReactDOM from 'react-dom'
import TriangleIcon from '@material-ui/icons/ChangeHistoryRounded'
import './loader.css'

// match color of NSWindow.titleBar
document.body.style.backgroundColor = 'rgb(117,117,117)'
const loaderContainer = document.createElement('div')
loaderContainer.setAttribute('id', 'LOADER_CONTAINER')
document.body.appendChild(loaderContainer)
const loaderElement = (
  <div className="page-container">
    <TriangleIcon id="LOADER_ICON" className="triangle-icon" />
  </div>
)
ReactDOM.render(loaderElement, loaderContainer)
