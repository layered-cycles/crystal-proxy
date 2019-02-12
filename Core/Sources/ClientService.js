import { eventChannel, buffers as Buffers } from 'redux-saga'

let _selectMainState = null

const ClientService = {
  downloadFrameImage: ({ serviceUrl, frameDimensions, frameLayers }) =>
    new Promise(resolve => {
      _ClientService.downloadFrameImage(
        serviceUrl,
        frameDimensions,
        frameLayers
      )
      resolve()
    }),
  hydrateImageViewer: ({ serviceUrl, frameDimensions, frameLayers }) =>
    new Promise(resolve => {
      _ClientService.hydrateImageViewer(
        serviceUrl,
        frameDimensions,
        frameLayers
      )
      resolve()
    }),
  hydrateMainWidget: coreState =>
    new Promise(resolve => {
      _hydrateMainWidget(coreState)
      resolve()
    }),
  launch: initialCoreState =>
    new Promise(resolve => {
      const clientMessageChannel = eventChannel(emitMessage => {
        _ClientService.launch(clientMessageString => {
          const clientMessage = JSON.parse(clientMessageString)
          switch (clientMessage.type) {
            case 'SETUP_MAIN_WIDGET':
              const { selectState } = clientMessage.payload
              const selectMainState = new Function(
                'coreState',
                `return (${selectState})(coreState)`
              )
              _selectMainState = selectMainState
              _hydrateMainWidget(initialCoreState)
              return
            case 'LAUNCH_IMAGE_VIEWER':
              _ClientService.launchImageViewer()
              return
            default:
              emitMessage(clientMessage)
          }
        })
        return () => null
      }, Buffers.expanding())
      resolve({ clientMessageChannel })
    })
}

function _hydrateMainWidget(coreState) {
  const nextMainState = _selectMainState(coreState)
  const coreMessage = {
    type: 'HYDRATE_MAIN_WIDGET',
    payload: { nextMainState }
  }
  const coreMessageString = JSON.stringify(coreMessage)
  _ClientService.postMainMessage(coreMessageString)
}

export default ClientService
