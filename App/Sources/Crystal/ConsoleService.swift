 enum ConsoleService: FixedCoreService {
  static let namespace = "_Console"
  
  static let api: JavaScriptEngine.Service.Api = [ 
    "log": log 
  ]
  
  static let log: @convention(block) (String) -> Void = { 
    print($0) 
  }
 }