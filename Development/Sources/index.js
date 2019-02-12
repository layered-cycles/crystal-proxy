const Child = require('child_process')
const createSagaCore = require('create-saga-core')
const { call, spawn, take } = require('redux-saga/effects')
const { eventChannel, buffers } = require('redux-saga')
const createFileWatcher = require('node-watch')
const createBundler = require('webpack')
const coreWebpackConfig = require('../core.webpack.config')
const widgetsWebpackConfig = require('../widgets.webpack.config')

createSagaCore({ initializer })

function* initializer() {
  yield call(makeStageDirectory)
  yield call(copyAppIconToStage)
  yield call(updateMacExecutable)
  yield spawn(macExecutableProcessor)
  yield spawn(coreBundleProcessor)
  yield spawn(widgetsBundleProcessor)
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
    Child.exec('cp ../App/CrystalIcon.png ./Stage', copyError => {
      if (copyError) throw copyError
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
      ['build', '--package-path', '../App'],
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
      'cp ../App/.build/x86_64-apple-macosx10.10/debug/Crystal ./Stage',
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
    Child.exec('pkill -f Crystal', () => resolve())
  })
}

function runMacExecutable() {
  return new Promise(resolve => {
    console.log('running mac executable...')
    console.log('')
    Child.spawn('./Crystal', [], {
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
      createFileWatcher(
        ['../App/Sources'],
        {
          recursive: true
        },
        () =>
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

function* widgetsBundleProcessor() {
  const { widgetsBundlerChannel } = yield call(startWidgetsBundler)
  while (true) {
    yield take(widgetsBundlerChannel)
    yield call(restartMacExecutable)
  }
}

function startWidgetsBundler() {
  return new Promise(resolve => {
    console.log('starting widgets bundler...')
    console.log('')
    const widgetsBundlerChannel = eventChannel(emitMessage => {
      const bundler = createBundler(widgetsWebpackConfig)
      bundler.watch({}, (watchError, watchStats) => {
        if (watchError) throw watchError
        const formattedWatchStats = watchStats.toString({
          chunks: false,
          colors: true
        })
        console.log('widgets output updated...')
        console.log(formattedWatchStats)
        console.log('')
        emitMessage({
          type: 'WIDGETS_OUTPUT_UPDATED'
        })
      })
      return () => null
    }, buffers.expanding())
    resolve({ widgetsBundlerChannel })
  })
}
