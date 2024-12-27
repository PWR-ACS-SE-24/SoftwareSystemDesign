export const envPort = (): number => parseInt(Deno.env.get("PORT") ?? "8000");
