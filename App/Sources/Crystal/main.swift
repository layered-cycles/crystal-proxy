import Cocoa

// app icon workaround
let iconFilePath = Bundle.main.resourceURL!.appendingPathComponent("applet.icns").path
let iconImage = NSImage(
  contentsOfFile: iconFilePath)
let executableFilePath = Bundle.main.resourceURL!.appendingPathComponent("Crystal").path
NSWorkspace.shared.setIcon(iconImage,
  forFile: )

class AppDelegate: NSObject, NSApplicationDelegate {
  let clientService = ClientService()

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
      withTitle: "About", 
      action: #selector(self.displayAboutPanel), 
      keyEquivalent: "")
    columnMenu.addItem(NSMenuItem.separator())
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
    let coreProxyScriptURL = Bundle.main.resourceURL!.appendingPathComponent("proxy-core.js")
    let coreProxyScript = try! String(
      contentsOf: coreProxyScriptURL, 
      encoding: .utf8)
    JavaScriptEngine.launch(
      script: coreProxyScript,
      with: [
        ConsoleService.javaScriptService,
        self.clientService.javaScriptService,
        CrystalService.javaScriptService
      ])    
    self.clientService.windowController.showWindow(nil)
  }

  @objc func displayAboutPanel() {
    if #available(macOS 10.13, *) {      
      NSApplication.shared.orderFrontStandardAboutPanel(
        options: [
          NSApplication.AboutPanelOptionKey.applicationIcon: NSRunningApplication.current.icon!,
          NSApplication.AboutPanelOptionKey.applicationVersion: "0.1.0"
        ])
    }
  }
}

let app = NSApplication.shared
let appDelegate = AppDelegate()
app.delegate = appDelegate
NSApp.run()
