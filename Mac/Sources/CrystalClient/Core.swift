import Foundation
import JavaScriptCore

enum Core {
  static func launch(
    script: String,
    with services: [Service] = [])
  {
    let container = JSVirtualMachine()
    let executionEnvironment = JSContext(
      virtualMachine: container)!
    services.forEach {
      $0.load(
        within: executionEnvironment)
    }
    executionEnvironment
      .evaluateScript(script)
  }
  static func read(
    scriptAtPath scriptPath: String)
  throws -> String {
    let scriptURL = URL(
      fileURLWithPath: scriptPath)
    guard let script = try? String(
      contentsOf: scriptURL)
    else {
      throw "Failed to read script at \(scriptURL)."
    }
    return script
  }
}

extension Core {
  enum Service {
    case fixed(FixedCoreService.Type)
    case stateful(StatefulCoreService)
    typealias Api = [String: Any]
    func load(
      within environment: JSContext)
    {
      let serviceNamespace: String
      let serviceApi: Api
      switch self {
      case .fixed(let service):
        serviceNamespace = service.namespace
        serviceApi = service.api
      case .stateful(let service):
        serviceNamespace = service.namespace
        serviceApi = service.api
      }
      let mountProperties =
        serviceApi.reduce("") {
          (result, property) in
          let (key, callback) = property
          let block = callback as AnyObject
          let globalHandle =
            "\(serviceNamespace)_\(key)_NATIVE"
          environment.setObject(block,
            forKeyedSubscript: globalHandle
              as NSCopying & NSObjectProtocol)
          let asyncCallbackWrapper =
            """
            (...args) =>
              new Promise(resolve => {
                let result = \(globalHandle)(...args)
                resolve(result)
              })
            """
          return "\(result)\(key):\(asyncCallbackWrapper),"
        }
      let mountStatement =
        "const \(serviceNamespace)={\(mountProperties)}"
      environment
        .evaluateScript(mountStatement)
    }
  }
}

protocol FixedCoreService {
  static var namespace: String { get }
  static var api: Core.Service.Api { get }
}

protocol StatefulCoreService {
  var namespace: String { get }
  var api: Core.Service.Api { get }
}

extension FixedCoreService {
  static var coreService: Core.Service {
    return .fixed(self)
  }
}

extension StatefulCoreService {
  var coreService: Core.Service {
    return .stateful(self)
  }
}

extension String: Error {}
