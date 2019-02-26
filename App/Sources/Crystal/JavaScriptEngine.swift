import Foundation
import JavaScriptCore

enum JavaScriptEngine {
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
    executionEnvironment.evaluateScript(script)
  }
}

extension JavaScriptEngine {
  enum Service {
    typealias Api = [String: Any]

    case fixed(FixedCoreService.Type)
    case stateful(StatefulCoreService)

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
      let mountProperties = serviceApi.reduce("") {
        (result, property) in
        let (key, callback) = property
        let block = callback as AnyObject
        let globalHandle = "\(serviceNamespace)_\(key)_NATIVE"
        environment.setObject(block,
          forKeyedSubscript: globalHandle as NSCopying & NSObjectProtocol)
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
      let mountStatement = "const \(serviceNamespace)={\(mountProperties)}"
      environment.evaluateScript(mountStatement)
    }
  }
}

protocol FixedCoreService {
  static var namespace: String { get }
  static var api: JavaScriptEngine.Service.Api { get }
}

protocol StatefulCoreService {
  var namespace: String { get }
  var api: JavaScriptEngine.Service.Api { get }
}

extension FixedCoreService {
  static var javaScriptService: JavaScriptEngine.Service {
    return .fixed(self)
  }
}

extension StatefulCoreService {
  var javaScriptService: JavaScriptEngine.Service {
    return .stateful(self)
  }
}

extension String: Error {}
