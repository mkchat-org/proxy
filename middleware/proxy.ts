import { Context, Next } from "https://deno.land/x/hono@v3.0.0-rc.3/mod.ts";

export function proxy(url: string, prefix: string) {
    return async (ctx: Context, next: Next) => {
        const reqUrl = new URL(ctx.req.url.replace(`/${prefix}`, ""));
        const uri = new URL(url);
        uri.pathname = reqUrl.pathname;
        uri.search = reqUrl.search;

        const req = new Request(uri, {
            method: ctx.req.method,
            headers: ctx.req.headers,
            body: ctx.req.body,
            referrer: ctx.req.referrer,
            referrerPolicy: ctx.req.referrerPolicy,
            mode: ctx.req.mode,
            credentials: ctx.req.credentials,
            cache: ctx.req.cache,
            redirect: ctx.req.redirect,
            integrity: ctx.req.integrity
        });

        const res = await fetch(req);

        await next();

        return res;
    };
};