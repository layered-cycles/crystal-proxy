 import Cocoa
 
 class AppDelegate: NSObject, NSApplicationDelegate {
  let userInterface = UserInterface()

  func applicationDidFinishLaunching(
    _ notification: Notification) 
  {
    let clientCoreBundle =
      try! Core.read(
        scriptAtPath: "./client-core.js")
    Core.launch(
      script: clientCoreBundle,
      with: [
        Console.coreService,
        userInterface.coreService,
        CrystalService.coreService
      ])
  }

  func applicationDidBecomeActive(_ notification: Notification) {
    userInterface
      .mainWindowController
      .window!
      .orderFrontRegardless()
    userInterface
      .imageWindowController
      .window!
      .orderFrontRegardless()
  }
}

let app = NSApplication.shared
let appDelegate = AppDelegate()
app.delegate = appDelegate
NSApp.setActivationPolicy(NSApplication.ActivationPolicy.regular)
NSApp.activate(
  ignoringOtherApps: true)
NSApp.run()
