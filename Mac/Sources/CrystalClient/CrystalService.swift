import JavaScriptCore
import Alamofire

enum CrystalService {
  static func _loadFrameSchema(
    serviceUrlString: String, 
    schemaSourceString: String, 
    completionHandler: JSValue) 
  {
    Alamofire
      .request(
        "\(serviceUrlString)/api", 
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
      response in
      completionHandler.call(
        withArguments: [])  
    }
  }
}

extension CrystalService: FixedCoreService {
  static let namespace = "_CrystalService"
  
  static let api: Core.Service.Api = [
    "loadFrameSchema": loadFrameSchema
  ]

  static var loadFrameSchema:  @convention(block) (String, String, JSValue) -> Void {
    return CrystalService._loadFrameSchema
  }
}