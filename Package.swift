// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "App",
    dependencies: [
        .package(url: "https://github.com/hummingbird-project/hummingbird.git", from: "2.16.0"),
        .package(url: "https://github.com/swift-server/async-http-client.git", from: "1.29.0"),
    ],
    targets: [
        .executableTarget(
            name: "App",
            dependencies: [
                .product(name: "Hummingbird", package: "hummingbird"),
                .product(name: "AsyncHTTPClient", package: "async-http-client"),
            ]
        )
    ]
)
