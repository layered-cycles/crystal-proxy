import Cocoa
import JavaScriptCore
import WebKit
import Vapor

final class UserInterface {
  var mainWindowController: MainWindowController!

  func _launch(userInputMessageHandler: JSValue) {
    _startWebsocketServer(
      userInputMessageHandler: userInputMessageHandler) 
    mainWindowController = MainWindowController()
  }

  func _launchImageViewer() {
    mainWindowController.launchImageViewer()
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
        if nextImageData.isEmpty || frameLayers.count == 0 {
          self.mainWindowController.displayNoImage()
          return 
        }
        self.mainWindowController.displayImage(
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
      "launchImageViewer": launchImageViewer,
      "hydrateMainWidget": hydrateMainWidget,
      "hydrateImageViewer": hydrateImageViewer,
      "downloadFrameImage": downloadFrameImage
    ]
  }

  var launch: @convention(block) (JSValue) -> () {
    return self._launch
  }

  var launchImageViewer: @convention(block) () -> () {
    return self._launchImageViewer
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
  let imageViewController = ImageViewController()

  init() {
    let mainWidgetWindow = NSWindow(
      contentViewController: viewController)
    mainWidgetWindow.animationBehavior = .documentWindow
    mainWidgetWindow.backgroundColor = NSColor(
      red: 246.0/255,
      green: 246.0/255,
      blue: 246.0/255,
      alpha: 1.0)      
    mainWidgetWindow.title = ""
    mainWidgetWindow.styleMask = NSWindow.StyleMask(rawValue:
      NSWindow.StyleMask.titled.rawValue |
      NSWindow.StyleMask.miniaturizable.rawValue)
    let contentSize = NSSize(
      width: 337.0,
      height: 644.0)
    mainWidgetWindow
      .setContentSize(contentSize)
    mainWidgetWindow.setFrameTopLeftPoint(
      NSPoint(
        x: 8, 
        y: NSScreen.main!.frame.height - 32))
    super.init(
      window: mainWidgetWindow)         
  }

  func launchImageViewer() {    
    DispatchQueue.main.async {      
      let imageViewerWindow = NSWindow(
        contentViewController: self.imageViewController)
      imageViewerWindow.animationBehavior = .documentWindow
      let contentSize = NSSize(
        width: 644.0,
        height: 644.0)      
      imageViewerWindow
        .setContentSize(contentSize)
      imageViewerWindow.setFrameTopLeftPoint(
        NSPoint(
          x: 360, 
          y: NSScreen.main!.frame.height - 32))
      imageViewerWindow.backgroundColor = NSColor(
          red: 246.0 / 255,
          green: 246.0 / 255,
          blue: 246.0 / 255,
          alpha: 1.0)
      imageViewerWindow.title = ""
      imageViewerWindow.styleMask = NSWindow.StyleMask.titled
      self.window!.addChildWindow(imageViewerWindow, 
        ordered: .below)
    }
  }

  func displayImage(imageData: Data) {              
    if imageViewController.view.subviews[0] != imageViewController.imageView {
      imageViewController.webView.removeFromSuperview()   
      imageViewController.view.addSubview(imageViewController.imageView)          
    }
    let imageWindow = window!.childWindows![0]
    let newImage = NSImage(
      data: imageData)!
    imageViewController.imageView.image = newImage
    let staleWindowFrame = imageWindow.frame     
    imageWindow.setContentSize(newImage.size)
    imageWindow.setFrameTopLeftPoint(NSPoint(
      x: staleWindowFrame.minX,
      y: staleWindowFrame.maxY))
    imageViewController.imageView.frame = imageViewController.view.frame
  }

  func displayNoImage() {
    if imageViewController.view.subviews[0] != imageViewController.webView {
      imageViewController.imageView.removeFromSuperview()      
      imageViewController.view.addSubview(imageViewController.webView)
      imageViewController.webView.frame = imageViewController.view.frame
    }
  }

  required init?(coder: NSCoder) {
    fatalError("WTF?")
  }
}

final class MainViewController: NSViewController, WKUIDelegate {  
  var webView: WKWebView!
  var webSocket: WebSocket!

  init() {
    super.init(
      nibName: nil, 
      bundle: nil)      
    let webConfiguration = WKWebViewConfiguration()
    webConfiguration
      .preferences
      .setValue(true, 
        forKey: "developerExtrasEnabled")
    webView = WKWebView(
      frame: .zero, 
      configuration: webConfiguration)      
    webView.set(
      backgroundColor: NSColor(
        red: 117.0/255,
        green: 117.0/255,
        blue: 117.0/255,
        alpha: 1.0))  
    webView.autoresizingMask = NSView.AutoresizingMask(rawValue: 
      NSView.AutoresizingMask.width.rawValue | 
      NSView.AutoresizingMask.height.rawValue)
    webView.uiDelegate = self  
    let loaderScriptUrl = URL(
      fileURLWithPath: "./loader.widget.js")
    let loaderScript = try! String(
      contentsOf: loaderScriptUrl)
    webView.evaluateJavaScript(loaderScript)
    let widgetScriptUrl = URL(
      fileURLWithPath: "./main.widget.js")
    let widgetScript = try! String(
      contentsOf: widgetScriptUrl)
    webView.evaluateJavaScript(widgetScript)
    view = webView
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

final class ImageViewController: NSViewController, WKUIDelegate {
  var imageView: NSImageView!
  var webView: WKWebView!

  override func loadView() {
    view = NSView()    
    let webConfiguration = WKWebViewConfiguration()
    webConfiguration
      .preferences
      .setValue(true, 
        forKey: "developerExtrasEnabled")
    webView = WKWebView(
      frame: .zero, 
      configuration: webConfiguration)    
    webView.autoresizingMask = NSView.AutoresizingMask(rawValue: 
      NSView.AutoresizingMask.width.rawValue | 
      NSView.AutoresizingMask.height.rawValue)
    webView.uiDelegate = self  
    let widgetScriptUrl = URL(
      fileURLWithPath: "./image.widget.js")
    let widgetScript = try! String(
      contentsOf: widgetScriptUrl)
    webView.evaluateJavaScript(widgetScript)
    view.addSubview(webView)
    if #available(macOS 10.12, *) {
      let emptyImage = NSImage()
      imageView = NSImageView(
        image: emptyImage)            
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

extension NSView {
  func set(backgroundColor: NSColor) {
    DispatchQueue.main.async {
      self.wantsLayer = true
      self.layer?.backgroundColor = backgroundColor.cgColor
    }    
  }
}