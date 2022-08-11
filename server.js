import crypto from "crypto";
import { request } from "undici";
import fastify from "fastify";
import proxy from "@fastify/http-proxy";
import { createClient } from "@supabase/supabase-js";
import config from "./config.js";

const app = fastify();
const supabase = createClient(config.DATABASE.URL, config.DATABASE.KEY);

app.addHook("preHandler", (_req, reply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    done();
});

app.register(proxy, { upstream: "https://media.discordapp.net", prefix: "discord" });

app.register(proxy, {
    upstream: "https://avatars.dicebear.com/",
    prefix: "/dicebear/avatars",
    rewritePrefix: "/api/adventurer-neutral/"
});

app.get("/discord/lottiesticker/:id", async (req, reply) => {
    const id = req.params.id;
    const { body } = await request(`https://discord.com/stickers/${id}.json`);
    
    reply.send(body);
});

app.all("/uploads/:hash", async (req, reply) => {
    const { data, error } = await supabase.from("uploads").select().match({ hash: req.params.hash });

    if (error) {
        reply.code(500).send("Database lookup error!");
    } else if (Array.isArray(data) && data[0]) {
        const { mime, buffer } = data[0];
        const file = Buffer.from(JSON.parse(buffer));
        reply.header("Content-Type", mime).send(file);
    } else {
        reply.status(404).send("Not found!");
    };
});

app.listen({ port: config.PORT }, (err, addr) => { 
    if (err) throw err;
    console.log(`MKChat proxy server listening at: ${addr}`);
});