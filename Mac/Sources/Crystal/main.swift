 import Cocoa
 
 class AppDelegate: NSObject, NSApplicationDelegate {
  let userInterface = UserInterface()

  func applicationDidFinishLaunching(
    _ notification: Notification) 
  {
    let mainMenu = NSMenu()
    let rowMenuItem = NSMenuItem(
      title: "", 
      action: nil, 
      keyEquivalent: "")
    let columnMenu = NSMenu()
    columnMenu.addItem(
      withTitle: "Quit", 
      action: #selector(NSApplication.terminate(_:)), 
      keyEquivalent: "q")
    rowMenuItem.submenu = columnMenu
    mainMenu.addItem(rowMenuItem)
    NSApp.mainMenu = mainMenu
    NSApp.setActivationPolicy(.regular)
    NSApp.activate(
      ignoringOtherApps: true)
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
NSApp.run()
