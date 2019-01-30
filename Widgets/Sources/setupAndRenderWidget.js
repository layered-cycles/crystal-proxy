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

const WidgetContext = React.createContext()

function setupAndRenderWidget(Widget) {
  class RootBehavior extends React.Component {
    state = {
      postUserMessage: null,
      widgetState: null
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
    }

    render() {
      return [
        <link
          key="roboto-font-link"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />,
        <WidgetContext.Provider
          key="widget-context-provider"
          value={this.state}
        >
          <MuiThemeProvider theme={crystalTheme}>
            <Widget />
          </MuiThemeProvider>
        </WidgetContext.Provider>
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
export { WidgetContext }
