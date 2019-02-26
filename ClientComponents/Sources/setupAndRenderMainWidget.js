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

function setupAndRenderMainWidget(MainWidget) {
  class Instance extends React.Component {
    state = {
      postCoreMessage: null,
      widgetState: MainWidget.getDefaultState()
    }

    componentDidMount() {
      const webSocket = new WebSocket(`ws://localhost:3001/io`)
      const postCoreMessage = clientMessage => {
        const clientMessageString = JSON.stringify(clientMessage)
        webSocket.send(clientMessageString)
      }
      webSocket.addEventListener('open', () => {
        postCoreMessage({
          type: 'SETUP_MAIN_WIDGET',
          payload: {
            selectState: `${MainWidget.selectState}`
          }
        })
        webSocket.addEventListener('message', messageEvent => {
          const coreMessage = JSON.parse(messageEvent.data)
          switch (coreMessage.type) {
            case 'HYDRATE_MAIN_WIDGET':
              const { nextMainState } = coreMessage.payload
              this.setState({
                widgetState: nextMainState
              })
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
          postCoreMessage({
            type: 'LAUNCH_IMAGE_VIEWER'
          })
        })
      this.setState({ postCoreMessage })
    }

    render() {
      return (
        <WIDGET_CONTEXT.Provider
          value={{
            postCoreMessage: this.state.postCoreMessage
          }}
          key="widget-context-provider"
        >
          <MuiThemeProvider theme={CRYSTAL_THEME}>
            <MainWidget {...this.state.widgetState} />
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

export default setupAndRenderMainWidget
export { WIDGET_CONTEXT }
