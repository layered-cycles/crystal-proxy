import Cocoa
import JavaScriptCore

final class UserInterface {
  var mainWindowController: MainWindowController!

  func setup() {    
    mainWindowController = MainWindowController()
  }
}

extension UserInterface: StatefulCoreService {
  var namespace: String {
    return "_UserInterface"
  }

  var api: Core.Service.Api {
    return ["launch": launch]
  }

  var launch: @convention(block) () -> () {
    return self.setup
  }
}

final class MainWindowController: NSWindowController {
  init() {
    let mainWidgetWindow = NSWindow()
    let initialWidth = 512.0 * 0.66
    let initialHeight = 550.0
    let initialContentSize = NSSize(
      width: initialWidth,
      height: initialHeight)
    mainWidgetWindow
      .setContentSize(initialContentSize)
    mainWidgetWindow.backgroundColor = NSColor(
      red: 246.0 / 255,
      green: 246.0 / 255,
      blue: 246.0 / 255,
      alpha: 1.0)
    mainWidgetWindow.titlebarAppearsTransparent = true
    mainWidgetWindow.title = "Main"
    mainWidgetWindow.styleMask = NSWindow.StyleMask(rawValue:
      NSWindow.StyleMask.titled.rawValue |
      NSWindow.StyleMask.closable.rawValue |
      NSWindow.StyleMask.miniaturizable.rawValue)
    super.init(
      window: mainWidgetWindow)
    self.showWindow(self)
  }

  required init?(coder: NSCoder) {
    fatalError("WTF?")
  }
}