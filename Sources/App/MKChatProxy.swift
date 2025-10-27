import AsyncHTTPClient
import Foundation
import HTTPTypes
import Hummingbird
import NIOCore

@main
struct MKChatProxy {
    static func main() async throws {
        let router = Router()
        let external = router.group("/external")
        let discord = external.group("/discord")
        let httpClient = HTTPClient(eventLoopGroupProvider: .singleton)

        router.add(
            middleware: CORSMiddleware(
                allowOrigin: .all,
                allowHeaders: [
                    HTTPField.Name.origin,
                    HTTPField.Name("X-Requested-With")!,
                    HTTPField.Name.contentType,
                    HTTPField.Name.accept,
                ],
                allowMethods: [.get, .post, .options]
            )
        )

        router.get("status") { request, _ -> Response in
            return Response(status: .ok)
        }

        external.group("/dicebear-avatars")
            .add(
                middleware: ProxyMiddleware(
                    httpClient,
                    baseURL: "https://api.dicebear.com/",
                    stripPrefix: "/external/dicebear-avatars",
                    rewritePrefix: "/9.x"
                )
            )
            .get(
                "**",
                use: { request, context -> Response in
                    return Response(status: .ok)
                })
        external.group("/tenor-media")
            .add(
                middleware: ProxyMiddleware(
                    httpClient,
                    baseURL: "https://media1.tenor.com",
                    stripPrefix: "/external/tenor-media",
                    rewritePrefix: "/m"
                )
            )
            .get(
                "**",
                use: { request, context -> Response in
                    return Response(status: .ok)
                })

        discord.group("/stickers")
            .add(
                middleware: ProxyMiddleware(
                    httpClient,
                    baseURL: "https://discord.com",
                    stripPrefix: "/external/discord/stickers",
                    rewritePrefix: "/stickers"
                )
            )
            .get(
                "**",
                use: { request, context -> Response in
                    return Response(status: .ok)
                })
        discord.add(
            middleware: ProxyMiddleware(
                httpClient,
                baseURL: "https://media.discordapp.net",
                stripPrefix: "/external/discord/"
            )
        )
        .get(
            "**",
            use: { request, context -> Response in
                return Response(status: .ok)
            }
        )

        let port = Int(ProcessInfo.processInfo.environment["PORT"] ?? "") ?? 8080

        let app = Application(
            router: router,
            configuration: .init(
                address: .hostname("0.0.0.0", port: port)
            )
        )

        try await app.runService()
        try await httpClient.shutdown()
    }
}
