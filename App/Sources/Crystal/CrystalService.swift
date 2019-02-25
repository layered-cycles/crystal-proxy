import JavaScriptCore
import Alamofire

enum CrystalService {
  static func _loadFrameSchema(
    serviceUrlString: String, 
    schemaSourceString: String, 
    completionHandler: JSValue) 
  {
    Alamofire
      .request("\(serviceUrlString)/api", 
        method: .post, 
        parameters: [
          "type": "LOAD_FRAME_SCHEMA",
          "payload": [
            "sourceCode": schemaSourceString
          ]
        ], 
        encoding: JSONEncoding.default)
      .response 
    { 
      alamoResponse in
      let maybeStatusCode = alamoResponse.response?.statusCode as Any
      completionHandler.call(
        withArguments: [maybeStatusCode])  
    }
  }

  static func renderFrameImage(
    serviceUrlString: String, 
    frameDimensions: [String: Double], 
    frameLayers: [AnyObject],
    completionHandler: @escaping (Data?) -> ()) 
  {
    Alamofire
      .request("\(serviceUrlString)/api", 
        method: .post, 
        parameters: [
          "type": "RENDER_FRAME_IMAGE",
          "payload": [
            "width": frameDimensions["width"]!,
            "height": frameDimensions["height"]!,
            "layers": frameLayers
          ]
        ], 
        encoding: JSONEncoding.default)
      .response 
    { 
      alamoResponse in
      let successfulRequest = alamoResponse.response?.statusCode == 200 
      let layersExist = frameLayers.count > 0
      let maybeImageData = successfulRequest && layersExist
        ? alamoResponse.data
        : nil
      completionHandler(maybeImageData)
    }
  }
}

extension CrystalService: FixedCoreService {
  static let namespace = "_Crystal"
  
  static let api: JavaScriptEngine.Service.Api = [
    "loadFrameSchema": loadFrameSchema
  ]

  static var loadFrameSchema:  @convention(block) (String, String, JSValue) -> Void {
    return CrystalService._loadFrameSchema
  }
}