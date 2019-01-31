import createSagaCore from 'create-saga-core'
import { spawn, select, call, take, put } from 'redux-saga/effects'
import UserInterface from './UserInterface'

createSagaCore({ reducer, initializer })

function reducer(state = createInitialState(), action) {
  switch (action.type) {
    case 'SERVICE_URL_UPDATED':
      return handleServiceUrlUpdated(state, action.payload)
    case 'FRAME_DIMENSIONS_UPDATED':
      return handleFrameDimensionsUpdated(state, action.payload)
    default:
      return state
  }
}

function createInitialState() {
  return {
    serviceUrl: 'http://localhost:3000',
    frameDimensions: {
      width: 512,
      height: 512
    }
  }
}

function handleServiceUrlUpdated(state, { serviceUrl }) {
  return { ...state, serviceUrl }
}

function handleFrameDimensionsUpdated(state, { frameDimensions }) {
  return { ...state, frameDimensions }
}

function* initializer() {
  yield spawn(userInputProcessor)
  yield spawn(userInterfaceHydrator)
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
      case 'UPDATE_SERVICE_URL':
        yield call(handleUpdateServiceUrl, userInputMessage.payload)
        continue
      case 'UPDATE_FRAME_DIMENSIONS':
        yield call(handleUpdateFrameDimensions, userInputMessage.payload)
        continue
      default:
        throw Error(
          `Unrecognized user input message type: ${userInputMessage.type}`
        )
    }
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

function* handleUpdateFrameDimensions({ nextFrameDimensions }) {
  yield put({
    type: 'FRAME_DIMENSIONS_UPDATED',
    payload: {
      frameDimensions: nextFrameDimensions
    }
  })
}

function* userInterfaceHydrator() {
  while (true) {
    yield take(['SERVICE_URL_UPDATED', 'FRAME_DIMENSIONS_UPDATED'])
    const coreState = yield select()
    yield call(UserInterface.hydrate, coreState)
  }
}
