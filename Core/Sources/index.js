import createSagaCore from 'create-saga-core'

createSagaCore({ initializer })

function* initializer() {
  Console.log('Hello, CrystalClient!')
}
