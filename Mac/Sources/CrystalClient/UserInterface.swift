import Cocoa
import JavaScriptCore
import WebKit
import Vapor

final class UserInterface {
  var mainWindowController: MainWindowController!
  var imageWindowController: ImageWindowController!

  func _launch(userInputMessageHandler: JSValue) {
    _startWebsocketServer(
      userInputMessageHandler: userInputMessageHandler) 
    imageWindowController = ImageWindowController()
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

  func _hydrateMainWidget(widgetState: String) {
    mainWindowController
      .viewController
      .webSocket
      .send(widgetState)
  }

  func _hydrateImageViewer(
    serviceUrlString: String, 
    frameDimensions: [String: Double], 
    frameLayers: [AnyObject]) 
  {
    CrystalService.renderFrameImage(
      serviceUrlString: serviceUrlString,
      frameDimensions: frameDimensions, 
      frameLayers: frameLayers) {
        nextImageData in
        if nextImageData.isEmpty { return }
        self.imageWindowController.updateImage(
          imageData: nextImageData)
      }
  }

  func _downloadFrameImage(
    serviceUrlString: String, 
    frameDimensions: [String: Double], 
    frameLayers: [AnyObject]) 
  {
    DispatchQueue.main.async {
      let savePanel = NSSavePanel()
      savePanel.allowedFileTypes = ["png"]
      savePanel.beginSheetModal(
        for: self.mainWindowController.window!)
      {
        response in 
        if response == .OK {
          CrystalService.renderFrameImage(
            serviceUrlString: serviceUrlString,
            frameDimensions: frameDimensions, 
            frameLayers: frameLayers) {
              imageData in
              if imageData.isEmpty { return }
              try! imageData.write(
                to: savePanel.url!,
                options: [.atomic])
            }
        }
      }
    }
  }
}

extension UserInterface: StatefulCoreService {
  var namespace: String {
    return "_UserInterface"
  }

  var api: Core.Service.Api {
    return [
      "launch": launch,
      "hydrateMainWidget": hydrateMainWidget,
      "hydrateImageViewer": hydrateImageViewer,
      "downloadFrameImage": downloadFrameImage
    ]
  }

  var launch: @convention(block) (JSValue) -> () {
    return self._launch
  }

  var hydrateMainWidget: @convention(block) (String) -> () {
    return self._hydrateMainWidget
  }

  var hydrateImageViewer: @convention(block) (String, [String: Double], [AnyObject]) -> () {
    return self._hydrateImageViewer
  }

  var downloadFrameImage: @convention(block) (String, [String: Double], [AnyObject]) -> () {
    return self._downloadFrameImage
  }
}

final class MainWindowController: NSWindowController {
  let viewController =  MainViewController()

  init() {
    let mainWidgetWindow = NSWindow(
      contentViewController: viewController)
    let initialWidth = 338.0
    let initialHeight = 644.0
    let initialContentSize = NSSize(
      width: initialWidth,
      height: initialHeight)
    mainWidgetWindow
      .setContentSize(initialContentSize)
    mainWidgetWindow.setFrameTopLeftPoint(
      NSPoint(
        x: 8, 
        y: NSScreen.main!.frame.height - 32))
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

@available(macOS 10.12, *)
extension MainViewController {
  func webView(
    _ webView: WKWebView, 
    runOpenPanelWith parameters: WKOpenPanelParameters, 
    initiatedByFrame frame: WKFrameInfo,
    completionHandler: @escaping ([URL]?) -> Void) 
  {
    let openPanel = NSOpenPanel()
    openPanel.canChooseFiles = true
    openPanel.begin { 
      result in
      guard result == NSApplication.ModalResponse.OK 
      else {
        completionHandler(nil)
        return
      }
      completionHandler([openPanel.url!])
    }
  }
}

final class ImageWindowController: NSWindowController {
  let viewController = ImageViewController()

  init() {
    let imageViewerWindow = NSWindow(
      contentViewController: viewController)
    let initialWidth = 512.0
    let initialHeight = 512.0
    let initialContentSize = NSSize(
      width: initialWidth,
      height: initialHeight)      
    imageViewerWindow
      .setContentSize(initialContentSize)
    imageViewerWindow.setFrameTopLeftPoint(
      NSPoint(
        x: 360, 
        y: NSScreen.main!.frame.height - 32))
    imageViewerWindow.backgroundColor = NSColor(
      red: 246.0 / 255,
      green: 246.0 / 255,
      blue: 246.0 / 255,
      alpha: 1.0)
    imageViewerWindow.titlebarAppearsTransparent = true
    imageViewerWindow.title = "Image"
    imageViewerWindow.styleMask = NSWindow.StyleMask(rawValue:
      NSWindow.StyleMask.titled.rawValue |
      NSWindow.StyleMask.closable.rawValue |
      NSWindow.StyleMask.miniaturizable.rawValue)
    super.init(
      window: imageViewerWindow)
    self.showWindow(self)
  }

  func updateImage(imageData: Data) {
    let newImage = NSImage(
      data: imageData)!
    viewController.imageView.image = newImage
    window!.setContentSize(newImage.size)
  }

  required init?(coder: NSCoder) {
    fatalError("WTF?")
  }
}

final class ImageViewController: NSViewController {
  var imageView: NSImageView!

  override func loadView() {
    if #available(macOS 10.12, *) {
      let emptyImage = NSImage()
      imageView = NSImageView(
        image: emptyImage)
      view = imageView
    }    
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