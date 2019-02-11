import React from 'react'
import ReactDOM from 'react-dom'
import AppIcon from '@material-ui/icons/ChangeHistoryRounded'
import './mainloading.css'

document.body.style.backgroundColor = 'rgb(117,117,117)'
const loadingContainer = document.createElement('div')
loadingContainer.setAttribute('id', 'LOADING_CONTAINER')
document.body.appendChild(loadingContainer)
const loadingElement = (
  <div className="page-container">
    <AppIcon className="app-icon" id="LOADING_ICON" />
  </div>
)
ReactDOM.render(loadingElement, loadingContainer)
