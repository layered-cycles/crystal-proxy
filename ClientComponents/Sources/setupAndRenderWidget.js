import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Grey from '@material-ui/core/colors/grey'
import React from 'react'
import ReactDOM from 'react-dom'
import './widget.css'

const CRYSTAL_THEME = createMuiTheme({
  palette: {
    primary: {
      main: Grey[600]
    }
  },
  typography: {
    useNextVariants: true
  }
})

const WIDGET_CONTEXT = React.createContext()

function setupAndRenderWidget(Widget) {
  class Instance extends React.Component {
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
      document
        .getElementById('LOADING_ICON')
        .addEventListener('animationend', () => {
          document.getElementById('LOADING_CONTAINER').style.visibility =
            'hidden'
          document.body.style.backgroundColor = 'rgb(246,246,246)'
          document.getElementById('WIDGET_CONTAINER').style.visibility =
            'visible'
          postUserMessage({
            type: 'LAUNCH_IMAGE_VIEWER'
          })
        })
      this.setState({ postUserMessage })
    }

    render() {
      return (
        <WIDGET_CONTEXT.Provider
          value={{
            postUserMessage: this.state.postUserMessage
          }}
          key="widget-context-provider"
        >
          <MuiThemeProvider theme={CRYSTAL_THEME}>
            <Widget {...this.state.widgetState} />
          </MuiThemeProvider>
        </WIDGET_CONTEXT.Provider>
      )
    }
  }
  const widgetContainer = document.createElement('div')
  widgetContainer.setAttribute('id', 'WIDGET_CONTAINER')
  document.body.appendChild(widgetContainer)
  const widgetElement = <Instance />
  ReactDOM.render(widgetElement, widgetContainer)
}

export default setupAndRenderWidget
export { WIDGET_CONTEXT }
