 import Cocoa
 
 class AppDelegate: NSObject, NSApplicationDelegate {
  func applicationDidFinishLaunching(_ notification: Notification) {
    let clientCoreBundle =
      try! Core.read(
        scriptAtPath: "./client-core.js")
    Core.launch(
      script: clientCoreBundle,
      with: [Console.coreService])
  }
}

let app = NSApplication.shared
let appDelegate = AppDelegate()
app.delegate = appDelegate
NSApp.setActivationPolicy(NSApplication.ActivationPolicy.regular)
NSApp.activate(
  ignoringOtherApps: true)
NSApp.run()
