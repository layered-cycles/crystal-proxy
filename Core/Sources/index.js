import createSagaCore from 'create-saga-core'
import { call } from 'redux-saga/effects'

createSagaCore({ initializer })

function* initializer() {
  yield call(UserInterface.launch)
}

const UserInterface = {
  launch: new Promise(resolve => {
    _UserInterface.launch()
    resolve()
  })
}
