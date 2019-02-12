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
      let statusCode = alamoResponse.response!.statusCode
      completionHandler.call(
        withArguments: [statusCode])  
    }
  }

  static func renderFrameImage(
    serviceUrlString: String, 
    frameDimensions: [String: Double], 
    frameLayers: [AnyObject],
    completionHandler: @escaping (Data) -> ()) 
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
      completionHandler(alamoResponse.data!)
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