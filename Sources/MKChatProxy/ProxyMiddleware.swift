import AsyncHTTPClient
import Foundation
import HTTPTypes
import Hummingbird
import NIOCore

typealias HTTPClient = AsyncHTTPClient.HTTPClient

struct ProxyMiddleware<Context: RequestContext>: MiddlewareProtocol {
    typealias Input = Request
    typealias Output = Response

    let httpClient: HTTPClient
    let baseURL: String
    let stripPrefix: String
    let rewritePrefix: String

    init(
        _ httpClient: HTTPClient,
        baseURL: String,
        stripPrefix: String = "",
        rewritePrefix: String = "/"
    ) {
        self.httpClient = httpClient
        self.baseURL = baseURL
        self.stripPrefix = stripPrefix
        self.rewritePrefix = rewritePrefix
    }

    func handle(_ input: Input, context: Context, next: (Input, Context) async throws -> Output)
        async throws -> Output
    {
        let path = input.uri.string.dropFirst(
            input.uri.string.hasPrefix(self.stripPrefix) ? self.stripPrefix.count : 0
        )
        let url =
            baseURL.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
            + self.rewritePrefix
            + path

        context.logger.info("Proxying request to \(url)")

        let proxyRequest = HTTPClientRequest(url: url)
        let proxyResponse = try await self.httpClient.execute(proxyRequest, timeout: .seconds(30))

        var headers = HTTPFields()
        for header in proxyResponse.headers {
            if let fieldName = HTTPField.Name(header.name) {
                headers.append(.init(name: fieldName, value: header.value))
            }
        }

        let proxiedResponse = Response(
            status: .init(code: Int(proxyResponse.status.code)),
            headers: headers,
            body: .init(asyncSequence: proxyResponse.body)
        )

        return proxiedResponse
    }
}
