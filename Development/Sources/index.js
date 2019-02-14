const Child = require('child_process')
const createSagaCore = require('create-saga-core')
const { call, spawn, take } = require('redux-saga/effects')
const { eventChannel, buffers } = require('redux-saga')
const createFileWatcher = require('node-watch')
const createBundler = require('webpack')
const proxyCoreWebpackConfig = require('../proxycore.webpack.config')
const clientComponentsWebpackConfig = require('../clientcomponents.webpack.config')

createSagaCore({ initializer })

function* initializer() {
  yield call(makeStageDirectory)
  yield call(copyAppIconToStage)
  yield call(updateExecutable)
  yield spawn(executableProcessor)
  yield spawn(coreScriptProcessor)
  yield spawn(clientComponentsProcessor)
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

function copyAppIconToStage() {
  return new Promise(resolve => {
    console.log('copying app icon to stage...')
    console.log('')
    Child.exec('cp ../App/Crystal.png ./Stage', copyError => {
      if (copyError) throw copyError
      resolve()
    })
  })
}

function* updateExecutable() {
  yield call(buildExecutable)
  yield call(copyExecutableToStage)
  yield call(restartExecutable)
}

function buildExecutable() {
  return new Promise(resolve => {
    console.log('building executable...')
    const buildProcess = Child.spawn(
      'swift',
      ['build', '--package-path', '../App'],
      {
        stdio: 'inherit'
      }
    )
    buildProcess.on('close', () => {
      console.log('')
      resolve()
    })
  })
}

function copyExecutableToStage() {
  return new Promise(resolve => {
    console.log('copying executable to stage...')
    console.log('')
    Child.exec(
      'cp ../App/.build/x86_64-apple-macosx10.10/debug/Crystal ./Stage',
      copyError => {
        if (copyError) throw copyError
        resolve()
      }
    )
  })
}

function* restartExecutable() {
  yield call(killExecutable)
  yield call(runExecutable)
}

function killExecutable() {
  return new Promise(resolve => {
    console.log('killing executable...')
    console.log('')
    Child.exec('pkill -f Crystal', () => resolve())
  })
}

function runExecutable() {
  return new Promise(resolve => {
    console.log('running executable...')
    console.log('')
    Child.spawn('./Crystal', [], {
      cwd: './Stage',
      stdio: 'inherit'
    })
    resolve()
  })
}

function* executableProcessor() {
  const { executableWatcherChannel } = yield call(startExecutableWatcher)
  while (true) {
    yield take(executableWatcherChannel)
    yield call(updateExecutable)
  }
}

function startExecutableWatcher() {
  return new Promise(resolve => {
    console.log('starting executable watcher...')
    console.log('')
    const executableWatcherChannel = eventChannel(emitMessage => {
      createFileWatcher(
        ['../App/Sources'],
        {
          recursive: true
        },
        () =>
          emitMessage({
            type: 'EXECUTABLE_CHANGED'
          })
      )
      return () => null
    }, buffers.expanding())
    resolve({ executableWatcherChannel })
  })
}

function* coreScriptProcessor() {
  const { coreBundlerChannel } = yield call(startCoreBundler)
  while (true) {
    yield take(coreBundlerChannel)
    yield call(restartExecutable)
  }
}

function startCoreBundler() {
  return new Promise(resolve => {
    console.log('starting core script bundler...')
    console.log('')
    const coreBundlerChannel = eventChannel(emitMessage => {
      const bundler = createBundler(proxyCoreWebpackConfig)
      bundler.watch({}, (watchError, watchStats) => {
        if (watchError) throw watchError
        const formattedWatchStats = watchStats.toString({
          chunks: false,
          colors: true
        })
        console.log('core script updated...')
        console.log(formattedWatchStats)
        console.log('')
        emitMessage({
          type: 'CORE_SCRIPT_UPDATED'
        })
      })
      return () => null
    }, buffers.expanding())
    resolve({ coreBundlerChannel })
  })
}

function* clientComponentsProcessor() {
  const { clientBundlerChannel } = yield call(startClientBundler)
  while (true) {
    yield take(clientBundlerChannel)
    yield call(restartExecutable)
  }
}

function startClientBundler() {
  return new Promise(resolve => {
    console.log('starting client components bundler...')
    console.log('')
    const clientBundlerChannel = eventChannel(emitMessage => {
      const bundler = createBundler(clientComponentsWebpackConfig)
      bundler.watch({}, (watchError, watchStats) => {
        if (watchError) throw watchError
        const formattedWatchStats = watchStats.toString({
          chunks: false,
          colors: true
        })
        console.log('client components updated...')
        console.log(formattedWatchStats)
        console.log('')
        emitMessage({
          type: 'CLIENT_COMPONENTS_UPDATED'
        })
      })
      return () => null
    }, buffers.expanding())
    resolve({ clientBundlerChannel })
  })
}
