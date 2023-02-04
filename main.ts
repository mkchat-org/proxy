import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { Hono } from "https://deno.land/x/hono@v3.0.0-rc.3/mod.ts";
import { proxy } from "./middleware/proxy.ts";

const serv = new Hono();

serv.use("/discord/*", proxy("https://media.discordapp.net", "discord"));

serv.get("/discord/lottiesticker/:id", async (ctx) => {
    const id = ctx.req.param("id");
    const res = await fetch(`https://discord.com/stickers/${id}.json`);
    
    return res;
});

serv.get("/internal/avatars/seasonal/:username", async (ctx) => {
    const username = ctx.req.param("username") || "";
    const asciiCode = username.charAt(0).charCodeAt(0);
    const avatars = Deno.readDir("./avatars/");

    let tmp: string[] = [];
    for await (const av of avatars) {
        tmp.push(av.name);
    };
    
    const num = asciiCode % tmp.length; // (0xffffff * parseInt(asciiCode * 3)) & avatars.length - lol

    const avatar = await Deno.readFile(`./avatars/${tmp[num]}`);
    
    return ctx.body(avatar);
});

// app.get("/seasonal/halloween/avatars/:key", async (req, reply) => {
//     const { key } = req.params;
//     const username = key || " ";

//     const asciiCode = username.charAt(0).charCodeAt(0);
//     const avatars = await fs.readdir("./avatars/");
//     const num = asciiCode % avatars.length; // (0xffffff * parseInt(asciiCode * 3)) & avatars.length - lol

//     const avatar = await fs.readFile(`./avatars/${avatars[num]}`);

//     reply.header("Content-Type", "image/png").send(avatar);
// });

serve(serv.fetch);