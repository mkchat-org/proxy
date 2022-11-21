import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
import { Hono } from "https://deno.land/x/hono@v2.5.2/mod.ts";
import { proxy } from "./middleware/proxy.ts";

const serv = new Hono();

serv.use("/", proxy("https://google.com"));

serve(serv.fetch);