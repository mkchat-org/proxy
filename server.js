import { request } from "undici";
import fastify from "fastify";
import proxy from "fastify-http-proxy";
const app = fastify();
const PORT = process.env.PORT || 3000;

app.addHook("preHandler", (_req, reply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    done();
});

app.register(proxy, { upstream: "https://media.discordapp.net" });

app.register(proxy, {
    upstream: "https://avatars.dicebear.com/",
    prefix: "/avatars",
    rewritePrefix: "/api/adventurer-neutral/"
});

app.get("/lottiesticker/:id", async (req, reply) => {
    const id = req.params.id;
    const { body } = await request(`https://discord.com/stickers/${id}.json`);
    
    reply.send(body);
});

app.listen(PORT, process.env.HOST || "0.0.0.0", () => console.log(`MKChat proxy server running on port: ${PORT}`));
