 import Cocoa
 
 class AppDelegate: NSObject, NSApplicationDelegate {
  let window = NSWindow()
  
  func applicationDidFinishLaunching(_ notification: Notification) {
    window.contentView = NSView()
    let initialWidth = 512.0
    let initialHeight = 512.0
    let initialContentSize = NSSize(
      width: initialWidth, 
      height: initialHeight)
    window.setContentSize(initialContentSize)
    let aspectRatio = NSSize(
      width: initialWidth < initialHeight
        ? 1
        : initialWidth / initialHeight,
      height: initialWidth < initialHeight
        ? initialHeight / initialWidth
        : 1)
    window.contentAspectRatio = aspectRatio
    window.minSize = NSSize(
      width: 256 * aspectRatio.width,
      height: 256 * aspectRatio.height)
    window.styleMask = NSWindow.StyleMask(rawValue:
      NSWindow.StyleMask.titled.rawValue |
        NSWindow.StyleMask.closable.rawValue |
        NSWindow.StyleMask.miniaturizable.rawValue |
        NSWindow.StyleMask.resizable.rawValue)
    window.makeKeyAndOrderFront(nil)
  }
}

let app = NSApplication.shared
let appDelegate = AppDelegate()
app.delegate = appDelegate
NSApp.setActivationPolicy(NSApplication.ActivationPolicy.regular)
NSApp.activate(
  ignoringOtherApps: true)
NSApp.run()
