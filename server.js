import { request } from "undici";
import fastify from "fastify";
import proxy from "@fastify/http-proxy";
import config from "./config.js";

const app = fastify();

app.addHook("preHandler", (_req, reply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    done();
});

app.register(proxy, {
    upstream: "https://crhqywhiclgkpiblerkf.supabase.co/",
    prefix: "/attachments",
    rewritePrefix: "/storage/v1/object/public/attachments/"
});

app.register(proxy, { upstream: "https://media.discordapp.net", prefix: "discord" });

// app.register(proxy, {
//     upstream: "https://avatars.dicebear.com/",
//     prefix: "/dicebear/avatars",
//     rewritePrefix: "/api/adventurer-neutral/"
// });

app.register(proxy, {
    upstream: "https://adorable-avatars.broken.services/",
    prefix: "/dicebear/avatars"
});

app.get("/discord/lottiesticker/:id", async (req, reply) => {
    const id = req.params.id;
    const { body } = await request(`https://discord.com/stickers/${id}.json`);
    
    reply.send(await body.json());
});

app.listen({ port: config.PORT, host: config.HOST }, (err, addr) => { 
    if (err) {
        console.error(err);
    } else {
        console.log(`MKChat proxy server listening at: ${addr}`);
    };
});