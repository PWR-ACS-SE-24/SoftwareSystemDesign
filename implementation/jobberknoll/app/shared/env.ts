// TODO: Check env validity with Zod

export const envServerPort = (): number =>
  parseInt(Deno.env.get("SERVER_PORT") ?? "8000");

export const envDatabaseUrl = (): string =>
  Deno.env.get("DATABASE_URL") ?? (() => {
    throw new Error("DATABASE_URL is not set");
  })();

export const envProd = (): boolean => Boolean(Deno.env.get("PROD"));
