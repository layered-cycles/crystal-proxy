import Cocoa

class AppDelegate: NSObject, NSApplicationDelegate {
  let clientService = ClientService()

  func applicationDidFinishLaunching(
    _ notification: Notification) 
  {
    NSApp.setActivationPolicy(.accessory)
    NSApp.activate(
      ignoringOtherApps: true)    
    JavaScriptEngine.launch(
      script: ClientService.proxyCoreScript,
      with: [
        ConsoleService.javaScriptService,
        self.clientService.javaScriptService,
        CrystalService.javaScriptService
      ])    
    self.clientService.windowController.showWindow(nil)
  }
}

let app = NSApplication.shared
let appDelegate = AppDelegate()
app.delegate = appDelegate
NSApp.run()
