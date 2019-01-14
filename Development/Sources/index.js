const Child = require('child_process')
const createSagaCore = require('create-saga-core')
const { call, spawn, take } = require('redux-saga/effects')
const { eventChannel, buffers } = require('redux-saga')
const createFileWatcher = require('node-watch')
const createBundler = require('webpack')
const coreWebpackConfig = require('../webpack.config')

createSagaCore({ initializer })

function* initializer() {
  yield call(makeStageDirectory)
  yield call(updateMacExecutable)
  yield spawn(macExecutableProcessor)
  yield spawn(coreBundleProcessor)
}

function makeStageDirectory() {
  return new Promise(resolve => {
    console.log('making Stage directory...')
    console.log('')
    Child.exec('mkdir -p Stage', makeError => {
      if (makeError) throw makeError
      resolve()
    })
  })
}

function* updateMacExecutable() {
  yield call(buildMacExecutable)
  yield call(copyMacExecutableToStage)
  yield call(restartMacExecutable)
}

function buildMacExecutable() {
  return new Promise(resolve => {
    console.log('building mac executable...')
    const buildProcess = Child.spawn(
      'swift',
      ['build', '--package-path', '../Mac'],
      { stdio: 'inherit' }
    )
    buildProcess.on('close', () => {
      console.log('')
      resolve()
    })
  })
}

function copyMacExecutableToStage() {
  return new Promise(resolve => {
    console.log('copying mac executable to stage...')
    console.log('')
    Child.exec(
      'cp ../Mac/.build/x86_64-apple-macosx10.10/debug/CrystalClient ./Stage',
      copyError => {
        if (copyError) throw copyError
        resolve()
      }
    )
  })
}

function* restartMacExecutable() {
  yield call(killMacExecutable)
  yield call(runMacExecutable)
}

function killMacExecutable() {
  return new Promise(resolve => {
    console.log('killing mac executable...')
    console.log('')
    Child.exec('pkill -f CrystalClient', () => resolve())
  })
}

function runMacExecutable() {
  return new Promise(resolve => {
    console.log('running mac executable...')
    console.log('')
    Child.spawn('./CrystalClient', [], {
      cwd: './Stage',
      stdio: 'inherit'
    })
    resolve()
  })
}

function* macExecutableProcessor() {
  const { watcherChannel } = yield call(startExecutableSourceWatcher)
  while (true) {
    yield take(watcherChannel)
    yield call(updateMacExecutable)
  }
}

function startExecutableSourceWatcher() {
  return new Promise(resolve => {
    console.log('starting executable source watcher...')
    console.log('')
    const watcherChannel = eventChannel(emitMessage => {
      createFileWatcher(['../Mac/Sources'], { recursive: true }, () =>
        emitMessage({
          type: 'EXECUTABLE_SOURCE_CHANGED'
        })
      )
      return () => null
    }, buffers.expanding())
    resolve({ watcherChannel })
  })
}

function* coreBundleProcessor() {
  const { bundlerChannel } = yield call(startCoreBundler)
  while (true) {
    yield take(bundlerChannel)
    yield call(restartMacExecutable)
  }
}

function startCoreBundler() {
  return new Promise(resolve => {
    console.log('starting core bundler...')
    console.log('')
    const bundlerChannel = eventChannel(emitMessage => {
      const bundler = createBundler(coreWebpackConfig)
      bundler.watch({}, (watchError, watchStats) => {
        if (watchError) throw watchError
        const formattedWatchStats = watchStats.toString({
          chunks: false,
          colors: true
        })
        console.log('core bundle updated...')
        console.log(formattedWatchStats)
        console.log('')
        emitMessage({
          type: 'CLIENT_CORE_BUNDLE_UPDATED'
        })
      })
      return () => null
    }, buffers.expanding())
    resolve({ bundlerChannel })
  })
}
