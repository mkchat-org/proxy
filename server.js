import Fastify from "fastify";
import proxy from "fastify-http-proxy";
const app = Fastify();
const PORT = process.env.PORT || 3000, HOST = process.env.HOST || "0.0.0.0";

app.register(proxy, { upstream: "https://media.discordapp.net" });

app.register(proxy, {
    upstream: "https://avatars.dicebear.com/",
    prefix: "/avatars",
    rewritePrefix: "/api/adventurer-neutral/"
});

app.listen(PORT, HOST, () => console.log(`MKChat motd server running on port: ${PORT}`));