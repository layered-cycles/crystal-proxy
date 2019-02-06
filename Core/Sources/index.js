import createSagaCore from 'create-saga-core'
import { spawn, select, call, take, put } from 'redux-saga/effects'
import UserInterface from './UserInterface'
import CrystalService from './CrystalService'

createSagaCore({ reducer, initializer })

function reducer(state = createInitialState(), action) {
  switch (action.type) {
    case 'FRAME_DIMENSIONS_UPDATED':
      return handleFrameDimensionsUpdated(state, action.payload)
    case 'FRAME_LAYER_UPDATED':
      return handleFrameLayerUpdated(state, action.payload)
    case 'SERVICE_URL_UPDATED':
      return handleServiceUrlUpdated(state, action.payload)
    default:
      return state
  }
}

function createInitialState() {
  return {
    frameDimensions: {
      width: 512,
      height: 512
    },
    frameLayers: [],
    serviceUrl: 'http://localhost:3000'
  }
}

function handleFrameDimensionsUpdated(state, { frameDimensions }) {
  return { ...state, frameDimensions }
}

function handleFrameLayerUpdated(state, { layerIndex, frameLayer }) {
  const frameLayers = state.frameLayers.slice()
  if (frameLayer) {
    frameLayers.splice(layerIndex, 1, frameLayer)
  } else {
    frameLayers.splice(layerIndex, 1)
  }
  return { ...state, frameLayers }
}

function handleServiceUrlUpdated(state, { serviceUrl }) {
  return { ...state, serviceUrl }
}

function* initializer() {
  yield spawn(userInputProcessor)
  yield spawn(mainWidgetHydrator)
  yield spawn(imageViewerHydrator)
}

function* userInputProcessor() {
  const initialCoreState = yield select()
  const { userInputChannel } = yield call(
    UserInterface.launch,
    initialCoreState
  )
  while (true) {
    const userInputMessage = yield take(userInputChannel)
    switch (userInputMessage.type) {
      case 'UPDATE_FRAME_DIMENSIONS':
        yield call(handleUpdateFrameDimensions, userInputMessage.payload)
        continue
      case 'UPDATE_FRAME_LAYER':
        yield call(handleUpdateFrameLayer, userInputMessage.payload)
        continue
      case 'UPDATE_FRAME_SCHEMA':
        yield call(handleUpdateFrameSchema, userInputMessage.payload)
        continue
      case 'UPDATE_SERVICE_URL':
        yield call(handleUpdateServiceUrl, userInputMessage.payload)
        continue
      default:
        throw Error(
          `Unrecognized user input message type: ${userInputMessage.type}`
        )
    }
  }
}

function* handleUpdateFrameDimensions({ nextFrameDimensions }) {
  yield put({
    type: 'FRAME_DIMENSIONS_UPDATED',
    payload: {
      frameDimensions: nextFrameDimensions
    }
  })
}

function* handleUpdateFrameLayer({ nextLayer, nextIndex }) {
  yield put({
    type: 'FRAME_LAYER_UPDATED',
    payload: {
      frameLayer: nextLayer,
      layerIndex: nextIndex
    }
  })
}

function* handleUpdateFrameSchema({ nextSchemaSource }) {
  try {
    const { serviceUrl } = yield select()
    yield call(CrystalService.loadFrameSchema, {
      serviceUrl,
      schemaSource: nextSchemaSource
    })
  } catch {
    // handle error
  }
}

function* handleUpdateServiceUrl({ nextServiceUrl }) {
  yield put({
    type: 'SERVICE_URL_UPDATED',
    payload: {
      serviceUrl: nextServiceUrl
    }
  })
}

function* mainWidgetHydrator() {
  while (true) {
    yield take([
      'FRAME_DIMENSIONS_UPDATED',
      'FRAME_LAYER_UPDATED',
      'SERVICE_URL_UPDATED'
    ])
    const coreState = yield select()
    yield call(UserInterface.hydrateMainWidget, coreState)
  }
}

function* imageViewerHydrator() {
  while (true) {
    yield take(['FRAME_LAYER_UPDATED'])
    try {
      const { serviceUrl, frameDimensions, frameLayers } = yield select()
      yield call(UserInterface.hydrateImageViewer, {
        serviceUrl,
        frameDimensions,
        frameLayers
      })
    } catch {
      // handle error
    }
  }
}
