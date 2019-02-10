import { eventChannel, buffers as Buffers } from 'redux-saga'

let _selectMainWidgetState = null

const UserInterface = {
  launch: initialCoreState =>
    new Promise(resolve => {
      const userInputChannel = eventChannel(emitMessage => {
        _UserInterface.launch(userInterfaceMessageString => {
          const userInterfaceMessage = JSON.parse(userInterfaceMessageString)
          switch (userInterfaceMessage.type) {
            case 'SETUP_WIDGET':
              const { selectWidgetState } = userInterfaceMessage.payload
              const selectWidgetStateWrapper = new Function(
                'coreState',
                `return (${selectWidgetState})(coreState)`
              )
              _selectMainWidgetState = selectWidgetStateWrapper
              _hydrateMainWidget(initialCoreState)
              return
            case 'LAUNCH_IMAGE_VIEWER':
              _UserInterface.launchImageViewer()
              return
            default:
              emitMessage(userInterfaceMessage)
          }
        })
        return () => null
      }, Buffers.expanding())
      resolve({ userInputChannel })
    }),
  hydrateMainWidget: coreState =>
    new Promise(resolve => {
      _hydrateMainWidget(coreState)
      resolve()
    }),
  hydrateImageViewer: ({ serviceUrl, frameDimensions, frameLayers }) =>
    new Promise(resolve => {
      _UserInterface.hydrateImageViewer(
        serviceUrl,
        frameDimensions,
        frameLayers
      )
      resolve()
    }),
  downloadFrameImage: ({ serviceUrl, frameDimensions, frameLayers }) =>
    new Promise(resolve => {
      _UserInterface.downloadFrameImage(
        serviceUrl,
        frameDimensions,
        frameLayers
      )
      resolve()
    })
}

function _hydrateMainWidget(coreState) {
  const newMainWidgetState = _selectMainWidgetState(coreState)
  const hydrateWidgetMessage = {
    type: 'HYDRATE_WIDGET',
    payload: {
      widgetState: newMainWidgetState
    }
  }
  const hydrateWidgetMessageString = JSON.stringify(hydrateWidgetMessage)
  _UserInterface.hydrateMainWidget(hydrateWidgetMessageString)
}

export default UserInterface
