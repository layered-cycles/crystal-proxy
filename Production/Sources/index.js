const Child = require('child_process')
const createSagaCore = require('create-saga-core')
const { call } = require('redux-saga/effects')
const bundleWebpack = require('webpack')
const proxyCoreWebpackConfig = require('../proxycore.webpack.js')
const clientComponentsWebpackConfig = require('../clientcomponents.webpack.js')

createSagaCore({ initializer })

function* initializer() {
  yield call(removeStaleStage)
  yield call(makeStageDirectory)
  yield call(copyBundleTemplate)
  yield call(cleanAppPackage)
  yield call(buildExecutable)
  yield call(copyExecutableToBundle)
  yield call(updateExecutableDylibPaths)
  yield call(bundleProxyCore)
  yield call(bundleClientComponents)
}

function removeStaleStage() {
  return new Promise(resolve => {
    console.log('removing stale stage...')
    console.log('')
    Child.exec('rm -rf ./Stage', removeError => {
      if (removeError) throw removeError
      resolve()
    })
  })
}

function makeStageDirectory() {
  return new Promise(resolve => {
    console.log('making stage directory...')
    console.log('')
    Child.exec('mkdir -p Stage', makeError => {
      if (makeError) throw makeError
      resolve()
    })
  })
}

function copyBundleTemplate() {
  return new Promise(resolve => {
    console.log('copying bundle template...')
    console.log('')
    Child.exec('cp -R Template.app ./Stage/Crystal.app', copyError => {
      if (copyError) throw copyError
      resolve()
    })
  })
}

function cleanAppPackage() {
  return new Promise(resolve => {
    console.log('cleaning app package...')
    console.log('')
    Child.exec('swift package --package-path ../App clean', cleanError => {
      if (cleanError) throw cleanError
      resolve()
    })
  })
}

function buildExecutable() {
  return new Promise(resolve => {
    console.log('building executable...')
    console.log('')
    const buildProcess = Child.spawn(
      'swift',
      [
        'build',
        '--package-path',
        '../App',
        '--configuration',
        'release',
        '--static-swift-stdlib',
        '-Xswiftc',
        '-DRELEASE'
      ],
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

function copyExecutableToBundle() {
  return new Promise(resolve => {
    console.log('copying executable to stage...')
    console.log('')
    Child.exec(
      'cp ../App/.build/x86_64-apple-macosx10.10/release/Crystal ./Stage/Crystal.app/Contents/MacOS',
      copyError => {
        if (copyError) throw copyError
        resolve()
      }
    )
  })
}

function* updateExecutableDylibPaths() {
  yield call(
    updateDylibPath,
    '/usr/local/opt/libressl/lib/libssl.46.dylib',
    '/usr/lib/libssl.dylib'
  )
  yield call(
    updateDylibPath,
    '/usr/local/opt/libressl/lib/libcrypto.44.dylib',
    '/usr/lib/libcrypto.dylib'
  )
}

function updateDylibPath(previousPath, newPath) {
  return new Promise(resolve => {
    Child.exec(
      `install_name_tool -change ${previousPath} ${newPath} ./Stage/Crystal.app/Contents/MacOS/Crystal`,
      updateError => {
        if (updateError) throw updateError
        resolve()
      }
    )
  })
}

function bundleProxyCore() {
  return new Promise(resolve => {
    console.log('bundling proxy core...')
    bundleWebpack(proxyCoreWebpackConfig, (bundleError, watchStats) => {
      if (bundleError) throw bundleError
      const formattedWatchStats = watchStats.toString({
        chunks: false,
        colors: true
      })
      console.log(formattedWatchStats)
      console.log('')
      resolve()
    })
  })
}

function bundleClientComponents() {
  return new Promise(resolve => {
    console.log('bundling client components...')
    bundleWebpack(clientComponentsWebpackConfig, (bundleError, watchStats) => {
      if (bundleError) throw bundleError
      const formattedWatchStats = watchStats.toString({
        chunks: false,
        colors: true
      })
      console.log(formattedWatchStats)
      console.log('')
      resolve()
    })
  })
}
