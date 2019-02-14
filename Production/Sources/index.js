const Child = require('child_process')
const createSagaCore = require('create-saga-core')
const { call } = require('redux-saga/effects')
const bundleWebpack = require('webpack')
const proxyCoreWebpackConfig = require('../proxycore.webpack.js')
const clientComponentsWebpackConfig = require('../clientcomponents.webpack.js')

const DISTRIBUTE = process.argv[2] === '--distribute'

createSagaCore({ initializer })

function* initializer() {
  yield call(removeStaleStage)
  yield call(makeStageDirectory)
  yield call(copyBundleTemplate)
  yield call(copyAppIconToStage)
  yield call(cleanAppPackage)
  yield call(buildExecutable)
  yield call(copyExecutableToStage)
  yield call(bundleProxyCore)
  yield call(bundleClientComponents)
  if (DISTRIBUTE) {
    yield call(createDMG)
  }
}

function removeStaleStage() {
  return new Promise(resolve => {
    console.log('removing stale Stage...')
    console.log('')
    Child.exec('rm -rf ./Stage', removeError => {
      if (removeError) throw removeError
      resolve()
    })
  })
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

function copyBundleTemplate() {
  return new Promise(resolve => {
    console.log('copying bundle template...')
    console.log('')
    Child.exec('cp -R CrystalTemplate.app ./Stage/Crystal.app', copyError => {
      if (copyError) throw copyError
      resolve()
    })
  })
}

function copyAppIconToStage() {
  return new Promise(resolve => {
    console.log('copying app icon to stage...')
    console.log('')
    Child.exec(
      'cp ../App/Crystal.png ./Stage/Crystal.app/Contents/Resources',
      copyError => {
        if (copyError) throw copyError
        resolve()
      }
    )
  })
}

function cleanAppPackage() {
  return new Promise(resolve => {
    console.log('cleaning App package...')
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
    const buildProcess = Child.spawn(
      'swift',
      ['build', '--package-path', '../App', '--configuration', 'release'],
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
      'cp ../App/.build/x86_64-apple-macosx10.10/release/Crystal ./Stage/Crystal.app/Contents/Resources',
      copyError => {
        if (copyError) throw copyError
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

// NOTE: modifies self after codesign thus signing is useless
// NOTE: this is likely due to useing an applescript to launch
//
// function signAppBundle() {
//   return new Promise(resolve => {
//     console.log('signing app bundle...')
//     Child.execSync('xattr -cr ./Stage/Crystal.app/')
//     const createProcess = Child.spawn(
//       'codesign',
//       [
//         '--force',
//         '--deep',
//         '--sign',
//         'Developer ID Application: Jared Mathews',
//         './Stage/Crystal.app'
//       ],
//       {
//         stdio: 'inherit'
//       }
//     )
//     createProcess.on('close', () => {
//       console.log('')
//       resolve()
//     })
//   })
// }

function createDMG() {
  return new Promise(resolve => {
    console.log('creating dmg...')
    const createProcess = Child.spawn(
      'yarn',
      ['create-dmg', './Stage/Crystal.app', './Stage'],
      {
        stdio: 'inherit'
      }
    )
    createProcess.on('close', () => {
      console.log('')
      resolve()
    })
  })
}
