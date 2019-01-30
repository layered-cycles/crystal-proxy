import Cocoa
import JavaScriptCore
import WebKit
import Vapor

final class UserInterface {
  var mainWindowController: MainWindowController!

  func setup(userInputMessageHandler: JSValue) {
    _startWebsocketServer(
      userInputMessageHandler: userInputMessageHandler) 
    mainWindowController = MainWindowController()
  }

  func _startWebsocketServer(userInputMessageHandler: JSValue) {
    let serviceConfig = Config.default()
    let serviceEnvironment = try! Environment.detect()
    var serviceServices = Services.default()
    let serverConfig = NIOServerConfig.default(
      port: 3001)
    serviceServices.register(serverConfig)
    let socketServer = NIOWebSocketServer.default()
    socketServer.get("io") { 
      serverSocket, request in
      self.mainWindowController.viewController.webSocket = serverSocket
      serverSocket.onText { 
        clientSocket, messageString in
        userInputMessageHandler.call(
          withArguments: [messageString])
      }
    }
    serviceServices.register(
      socketServer, 
      as: WebSocketServer.self)
    let vapor = try! Application(
      config: serviceConfig, 
      environment: serviceEnvironment, 
      services: serviceServices)
    vapor.asyncRun()
  }

  func hydrateWidget(widgetState: String) {
    mainWindowController
      .viewController
      .webSocket
      .send(widgetState)
  }
}

extension UserInterface: StatefulCoreService {
  var namespace: String {
    return "_UserInterface"
  }

  var api: Core.Service.Api {
    return [
      "launch": launch,
      "hydrate": hydrate
    ]
  }

  var launch: @convention(block) (JSValue) -> () {
    return self.setup
  }

  var hydrate: @convention(block) (String) -> () {
    return self.hydrateWidget
  }
}

final class MainWindowController: NSWindowController {
  let viewController =  MainViewController()

  init() {
    let mainWidgetWindow = NSWindow(
      contentViewController: viewController)
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

final class MainViewController: NSViewController, WKUIDelegate {  
  var webView: WKWebView!
  var webSocket: WebSocket!

  override func loadView() {
    let webConfiguration = WKWebViewConfiguration()
    webConfiguration
      .preferences
      .setValue(true, 
        forKey: "developerExtrasEnabled")
    webView = WKWebView(
      frame: .zero, 
      configuration: webConfiguration)
    webView.uiDelegate = self        
    view = webView
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    let widgetScriptUrl = URL(
      fileURLWithPath: "./main.widget.js")
    let widgetScript = try! String(
      contentsOf: widgetScriptUrl)
    webView.evaluateJavaScript(widgetScript)
  }

  init() {
    super.init(
      nibName: nil, 
      bundle: nil)      
  }

  required init?(coder: NSCoder) {
    fatalError("WTF?")
  }
}