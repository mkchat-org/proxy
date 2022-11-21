import { Context } from "https://deno.land/x/hono@v2.5.2/mod.ts";

export async function proxy(url: string) {
    return (ctx: Context, next: any) => {
        console.log(url);
    };
};