// swift-tools-version:4.2
import PackageDescription

let package = Package(
    name: "CrystalClient",
    dependencies: [
      .package(
        url: "https://github.com/vapor/vapor.git", 
        from: "3.0.0"),
      .package(
        url: "https://github.com/Alamofire/Alamofire.git", 
        from: "4.2.0")
    ],
    targets: [
        .target(
            name: "CrystalClient",
            dependencies: ["Vapor", "Alamofire"])
    ]
)
