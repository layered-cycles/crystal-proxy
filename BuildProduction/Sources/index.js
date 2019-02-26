const Child = require('child_process')
const FS = require('fs')
const createSagaCore = require('create-saga-core')
const { call } = require('redux-saga/effects')
const bundleWebpack = require('webpack')
const createDMG = require('appdmg')
const proxyCoreWebpackConfig = require('../proxycore.webpack.js')
const clientComponentsWebpackConfig = require('../clientcomponents.webpack.js')

createSagaCore({ initializer })

function* initializer() {
  yield call(removeStaleStage)
  yield call(makeStageDirectory)
  yield call(bundleProxyCore)
  yield call(bundleClientComponents)
  yield call(copyAppPackage)
  yield call(cleanAppPackage)
  yield call(writeClientServiceExtension)
  yield call(buildExecutable)
  yield call(copyExecutableToStage)
  yield call(updateExecutableDylibPaths)
  yield call(signExecutable)
  yield call(createInstaller)
  yield call(signInstaller)
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

function copyAppPackage() {
  return new Promise(resolve => {
    console.log('copying app package...')
    console.log('')
    Child.exec('cp -R ../App ./Stage', copyError => {
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

function writeClientServiceExtension() {
  console.log('writing client service extension...')
  console.log('')
  return new Promise(resolve => {
    Promise.all([
      readAndEncodeScriptAt('./Stage/proxy-core.js'),
      readAndEncodeScriptAt('./Stage/main.loading.js'),
      readAndEncodeScriptAt('./Stage/main.widget.js'),
      readAndEncodeScriptAt('./Stage/noimage.display.js')
    ]).then(
      ([
        proxyCoreScript64,
        mainLoadingScript64,
        mainWidgetScript64,
        noImageDisplayScript64
      ]) => {
        const clientServiceExtensionFile = `
          import Foundation 

          extension ClientService {
            static var proxyCoreScript: String {
              let decodedData = Data(
                base64Encoded: "${proxyCoreScript64}")!
              return String(
                data: decodedData, 
                encoding: .utf8)!
            }
            static var mainLoadingScript: String {
              let decodedData = Data(
                base64Encoded: "${mainLoadingScript64}")!
              return String(
                data: decodedData, 
                encoding: .utf8)!
            } 
            static var mainWidgetScript: String {
              let decodedData = Data(
                base64Encoded: "${mainWidgetScript64}")!
              return String(
                data: decodedData, 
                encoding: .utf8)!
            }
            static var noImageDisplayScript: String {
              let decodedData = Data(
                base64Encoded: "${noImageDisplayScript64}")!
              return String(
                data: decodedData, 
                encoding: .utf8)!
            }
          }
        `
        FS.writeFile(
          './Stage/App/Sources/Crystal/ClientService_Assets.swift',
          clientServiceExtensionFile,
          writeError => {
            if (writeError) throw writeError
            resolve()
          }
        )
      }
    )
  })
}

function readAndEncodeScriptAt(filePath) {
  return new Promise(resolve => {
    FS.readFile(
      filePath,
      {
        encoding: 'utf-8'
      },
      (readError, script) => {
        if (readError) throw readError
        let encodedScript = Buffer.from(script).toString('base64')
        resolve(encodedScript)
      }
    )
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
        './Stage/App',
        '--configuration',
        'release',
        '--static-swift-stdlib'
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

function copyExecutableToStage() {
  return new Promise(resolve => {
    console.log('copying executable to stage...')
    console.log('')
    Child.exec(
      'cp ./Stage/App/.build/x86_64-apple-macosx10.10/release/Crystal ./Stage/Crystal',
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
      `install_name_tool -change ${previousPath} ${newPath} ./Stage/Crystal`,
      updateError => {
        if (updateError) throw updateError
        resolve()
      }
    )
  })
}

function signExecutable() {
  return new Promise(resolve => {
    console.log('signing executable...')
    const createProcess = Child.spawn(
      'codesign',
      ['--sign', 'Developer ID Application', './Stage/Crystal'],
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

function createInstaller() {
  return new Promise(resolve => {
    console.log('creating installer...')
    const createProcess = createDMG({
      target: './Stage/Crystal.dmg',
      basepath: process.cwd(),
      specification: {
        title: 'Crystal',
        background: './dmg-background.png',
        'icon-size': 160,
        format: 'ULFO',
        window: {
          size: {
            width: 660,
            height: 400
          }
        },
        contents: [
          {
            x: 180,
            y: 170,
            type: 'file',
            path: './Stage/Crystal'
          },
          {
            x: 480,
            y: 170,
            type: 'link',
            path: '/usr/local/bin'
          }
        ]
      }
    })
    createProcess.on('finish', () => {
      console.log('')
      resolve()
    })
  })
}

function signInstaller() {
  return new Promise(resolve => {
    console.log('signing installer...')
    const createProcess = Child.spawn(
      'codesign',
      ['--sign', 'Developer ID Application', './Stage/Crystal.dmg'],
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
