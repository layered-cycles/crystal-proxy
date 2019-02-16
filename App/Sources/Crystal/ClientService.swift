import Cocoa
import JavaScriptCore
import WebKit
import Vapor

let PRIMARY_GREY = NSColor(
  red: 117.0/255, 
  green: 117.0/255, 
  blue: 117.0/255, 
  alpha: 1.0)

let LIGHT_WHITE = NSColor(
  red: 246.0/255, 
  green: 246.0/255, 
  blue: 246.0/255, 
  alpha: 1.0)

final class ClientService {
  var windowController: WindowController!

  func _downloadFrameImage(
    serviceUrlString: String, 
    frameDimensions: [String: Double], 
    frameLayers: [AnyObject]) 
  {
    DispatchQueue.main.async {
      let savePanel = NSSavePanel()
      savePanel.allowedFileTypes = ["png"]
      savePanel.beginSheetModal(
        for: self.windowController.window!)
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

  func _hydrateFrameImage(
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
          self.windowController.displayNoImage(
            frameDimensions: frameDimensions)
          return 
        }
        self.windowController.displayImage(
          imageData: nextImageData)
      }
  }

  func _launchImageWindow() {
    self.windowController.launchImageWindow()
  }

  func _launchMainWindow(
    userInputMessageHandler: JSValue) 
  {
    self._startWebsocketServer(
      userInputMessageHandler: userInputMessageHandler) 
    self.windowController = WindowController()
  }

  func _startWebsocketServer(
    userInputMessageHandler: JSValue) 
  {
    let vaporConfig = Config.default()
    let vaporEnvironment = try! Environment.detect()
    var vaporServices = Services.default()
    let serverConfig = NIOServerConfig.default(
      port: 3001)
    vaporServices.register(serverConfig)
    let socketServer = NIOWebSocketServer.default()
    socketServer.get("io") { 
      serverSocket, _ in
      self.windowController.mainController.webSocket = serverSocket
      serverSocket.onText { 
        clientSocket, messageString in
        userInputMessageHandler.call(
          withArguments: [messageString])
      }
    }
    vaporServices.register(socketServer, 
      as: WebSocketServer.self)
    let vapor = try! Application(
      config: vaporConfig, 
      environment: vaporEnvironment, 
      services: vaporServices)
    _ = vapor.asyncRun()
  }

  func _postMainMessage(
    mainMessageString: String) 
  {
    self.windowController.mainController.webSocket.send(mainMessageString)
  }
}

extension ClientService: StatefulCoreService {
  var namespace: String {
    return "_Client"
  }

  var api: JavaScriptEngine.Service.Api {
    return [
      "downloadFrameImage": downloadFrameImage,
      "hydrateFrameImage": hydrateFrameImage,
      "launchImageWindow": launchImageWindow,
      "launchMainWindow": launchMainWindow,      
      "postMainMessage": postMainMessage,            
    ]
  }

  var downloadFrameImage: @convention(block) (String, [String: Double], [AnyObject]) -> () {
    return self._downloadFrameImage
  }

  var hydrateFrameImage: @convention(block) (String, [String: Double], [AnyObject]) -> () {
    return self._hydrateFrameImage
  }

  var launchImageWindow: @convention(block) () -> () {
    return self._launchImageWindow
  }

  var launchMainWindow: @convention(block) (JSValue) -> () {
    return self._launchMainWindow
  }

  var postMainMessage: @convention(block) (String) -> () {
    return self._postMainMessage
  }
}

final class WindowController: NSWindowController {
  let imageController = ImageController()
  let mainController = MainController()  

  init() {    
    let mainWindow = NSWindow(
      contentViewController: self.mainController)
    mainWindow.animationBehavior = .documentWindow
    mainWindow.backgroundColor = PRIMARY_GREY     
    mainWindow.title = ""
    let rawWindowStyleValue = 
      NSWindow.StyleMask.titled.rawValue |
      NSWindow.StyleMask.miniaturizable.rawValue
    mainWindow.styleMask = NSWindow.StyleMask(
      rawValue: rawWindowStyleValue)
    let contentSize = NSSize(
      width: 337.0,
      height: 644.0)
    mainWindow.setContentSize(contentSize)
    let mainWindowAnchor = NSPoint(
        x: 8, 
        y: NSScreen.main!.frame.height - 32)
    mainWindow.setFrameTopLeftPoint(mainWindowAnchor)
    super.init(
      window: mainWindow)        
  }

  func launchImageWindow() {    
    DispatchQueue.main.async {      
      let imageWindow = NSWindow(
        contentViewController: self.imageController)
      imageWindow.animationBehavior = .documentWindow
      let contentSize = NSSize(
        width: 644.0,
        height: 644.0)      
      imageWindow.setContentSize(contentSize)
      let imageWindowAnchor = NSPoint(
        x: 360, 
        y: NSScreen.main!.frame.height - 32)
      imageWindow.setFrameTopLeftPoint(imageWindowAnchor)
      imageWindow.backgroundColor = LIGHT_WHITE
      imageWindow.title = ""
      imageWindow.styleMask = NSWindow.StyleMask.titled
      self.window!.addChildWindow(imageWindow, 
        ordered: .below)
    }
  }

  func displayImage(
    imageData: Data) 
  {              
    if self.imageController.view.subviews[0] != self.imageController.imageView {
      self.imageController.webView.removeFromSuperview()   
      self.imageController.view.addSubview(self.imageController.imageView)          
    }
    let imageWindow = self.window!.childWindows![0]
    let newImage = NSImage(
      data: imageData)!
    self.imageController.imageView.image = newImage
    let staleWindowFrame = imageWindow.frame     
    imageWindow.setContentSize(newImage.size)
    let imageWindowAnchor = NSPoint(
      x: staleWindowFrame.minX,
      y: staleWindowFrame.maxY)
    imageWindow.setFrameTopLeftPoint(imageWindowAnchor)
    self.imageController.imageView.frame = self.imageController.view.frame
  }

  func displayNoImage(
    frameDimensions: [String: Double]) 
  {
    if self.imageController.view.subviews[0] != self.imageController.webView {
      self.imageController.imageView.removeFromSuperview()      
      self.imageController.view.addSubview(self.imageController.webView)
      self.imageController.webView.frame = self.imageController.view.frame
    }
    let imageWindow = self.window!.childWindows![0]
    let staleWindowFrame = imageWindow.frame
    let viewFrameSize = NSSize(
      width: frameDimensions["width"]!,
      height: frameDimensions["height"]!)     
    imageWindow.setContentSize(viewFrameSize)
    let imageWindowAnchor = NSPoint(
      x: staleWindowFrame.minX,
      y: staleWindowFrame.maxY)
    imageWindow.setFrameTopLeftPoint(imageWindowAnchor)
  }

  required init?(
    coder: NSCoder) 
  {
    fatalError("WTF?")
  }
}

final class MainController: NSViewController, WKUIDelegate {  
  var webSocket: WebSocket!
  var webView: WKWebView!  

  init() {
    super.init(
      nibName: nil, 
      bundle: nil)    
    let webConfiguration = WKWebViewConfiguration()
    webConfiguration.preferences.setValue(true, 
      forKey: "developerExtrasEnabled")
    self.webView = WKWebView(
      frame: .zero, 
      configuration: webConfiguration)      
    self.webView.set(
      backgroundColor: PRIMARY_GREY)
    let rawViewResizingValue = 
      NSView.AutoresizingMask.width.rawValue | 
      NSView.AutoresizingMask.height.rawValue
    self.webView.autoresizingMask = NSView.AutoresizingMask(
      rawValue: rawViewResizingValue)
    self.webView.uiDelegate = self  
    let loaderScriptUrl = Bundle.main.resourceURL!.appendingPathComponent("main.loading.js")
    let loaderScript = try! String(
      contentsOf: loaderScriptUrl)
    self.webView.evaluateJavaScript(loaderScript)
    let widgetScriptUrl = Bundle.main.resourceURL!.appendingPathComponent("main.widget.js")
    let widgetScript = try! String(
      contentsOf: widgetScriptUrl)
    self.webView.evaluateJavaScript(widgetScript)
    self.view = self.webView
  }

  required init?(
    coder: NSCoder) 
  {
    fatalError("WTF?")
  }
}

@available(macOS 10.12, *)
extension MainController {
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

final class ImageController: NSViewController, WKUIDelegate {
  var imageView: NSImageView!
  var webView: WKWebView!

  override func loadView() {
    self.view = NSView()    
    let webConfiguration = WKWebViewConfiguration()
    webConfiguration.preferences.setValue(true, 
      forKey: "developerExtrasEnabled")
    self.webView = WKWebView(
      frame: .zero, 
      configuration: webConfiguration)   
    let rawViewResizingValue = 
      NSView.AutoresizingMask.width.rawValue | 
      NSView.AutoresizingMask.height.rawValue 
    self.webView.autoresizingMask = NSView.AutoresizingMask(
      rawValue: rawViewResizingValue)
    self.webView.uiDelegate = self  
    let widgetScriptUrl = Bundle.main.resourceURL!.appendingPathComponent("noimage.display.js")
    let widgetScript = try! String(
      contentsOf: widgetScriptUrl)
    self.webView.evaluateJavaScript(widgetScript)
    self.view.addSubview(self.webView)
    if #available(macOS 10.12, *) {
      let emptyImage = NSImage()
      self.imageView = NSImageView(
        image: emptyImage)            
    }
  }

  init() {
    super.init(
      nibName: nil, 
      bundle: nil)      
  }

  required init?(
    coder: NSCoder) 
  {
    fatalError("WTF?")
  }
}

extension NSView {
  func set(
    backgroundColor: NSColor) 
  {
    DispatchQueue.main.async {
      self.wantsLayer = true
      self.layer?.backgroundColor = backgroundColor.cgColor
    }    
  }
}