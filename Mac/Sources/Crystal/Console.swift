 enum Console: FixedCoreService {
  static let namespace = "Console"
  
  static let api: Core.Service.Api =
    [ "log": log ]
  
  static let log: @convention(block) (String) -> Void =
    { print($0) }
 }