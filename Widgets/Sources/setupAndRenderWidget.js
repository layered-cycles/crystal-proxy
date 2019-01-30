import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import BlueGrey from '@material-ui/core/colors/bluegrey'
import React from 'react'
import ReactDOM from 'react-dom'

const crystalTheme = createMuiTheme({
  palette: {
    primary: {
      main: BlueGrey[500]
    }
  },
  typography: {
    useNextVariants: true
  }
})

function setupAndRenderWidget(Widget) {
  class RootBehavior extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      return [
        <link
          key="roboto-font-link"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />,
        <MuiThemeProvider key="widget-theme-provider" theme={crystalTheme}>
          <Widget />
        </MuiThemeProvider>
      ]
    }
  }
  // match color of NSWindow.titleBar
  document.body.style.backgroundColor = 'rgb(246,246,246)'
  const rootContainer = document.createElement('div')
  document.body.appendChild(rootContainer)
  const rootElement = <RootBehavior />
  ReactDOM.render(rootElement, rootContainer)
}

export default setupAndRenderWidget
