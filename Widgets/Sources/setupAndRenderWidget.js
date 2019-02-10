import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Grey from '@material-ui/core/colors/grey'
import React from 'react'
import ReactDOM from 'react-dom'
import './global.css'

const crystalTheme = createMuiTheme({
  palette: {
    primary: {
      main: Grey[600]
    }
  }
})

const WidgetContext = React.createContext()

function setupAndRenderWidget(Widget) {
  class Root extends React.Component {
    state = {
      postUserMessage: null,
      widgetState: Widget.getDefaultState()
    }

    componentDidMount() {
      const webSocket = new WebSocket(`ws://localhost:3001/io`)
      const postUserMessage = userMessage => {
        const messageString = JSON.stringify(userMessage)
        webSocket.send(messageString)
      }
      webSocket.addEventListener('open', () => {
        postUserMessage({
          type: 'SETUP_WIDGET',
          payload: {
            selectWidgetState: `${Widget.selectWidgetState}`
          }
        })
        webSocket.addEventListener('message', messageEvent => {
          const userInterfaceMessage = JSON.parse(messageEvent.data)
          switch (userInterfaceMessage.type) {
            case 'HYDRATE_WIDGET':
              const { widgetState } = userInterfaceMessage.payload
              this.setState({ widgetState })
              return
          }
        })
      })

      this.setState({ postUserMessage })
      document
        .getElementById('LOADER_ICON')
        .addEventListener('animationend', () => {
          document.getElementById('LOADER_CONTAINER').style.visibility =
            'hidden'
          document.body.style.backgroundColor = 'rgb(246,246,246)'
          document.getElementById('WIDGET_CONTAINER').style.visibility =
            'visible'
          this.state.postUserMessage({ type: 'LAUNCH_IMAGE_VIEWER' })
        })
    }

    render() {
      return (
        <WidgetContext.Provider
          key="widget-context-provider"
          value={{
            postUserMessage: this.state.postUserMessage
          }}
        >
          <MuiThemeProvider theme={crystalTheme}>
            <Widget {...this.state.widgetState} />
          </MuiThemeProvider>
        </WidgetContext.Provider>
      )
    }
  }
  // match color of NSWindow.titleBar
  const widgetContainer = document.createElement('div')
  widgetContainer.setAttribute('id', 'WIDGET_CONTAINER')
  document.body.appendChild(widgetContainer)
  const rootElement = <Root />
  ReactDOM.render(rootElement, widgetContainer)
}

export default setupAndRenderWidget
export { WidgetContext }
