import createSagaCore from 'create-saga-core'
import { spawn, select, call, take, put } from 'redux-saga/effects'
import UserInterface from './UserInterface'

createSagaCore({ reducer, initializer })

function reducer(state = createInitialState(), action) {
  switch (action.type) {
    case 'SERVICE_URL_UPDATED':
      return handleServiceUrlUpdated(state, action.payload)
    default:
      return state
  }
}

function createInitialState() {
  return {
    serviceUrl: 'http://localhost:3000'
  }
}

function handleServiceUrlUpdated(state, { serviceUrl }) {
  return { ...state, serviceUrl }
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

function* userInterfaceHydrator() {
  while (true) {
    yield take(['SERVICE_URL_UPDATED'])
    const coreState = yield select()
    yield call(UserInterface.hydrate, coreState)
  }
}
