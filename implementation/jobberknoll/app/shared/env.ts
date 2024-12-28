export const envServerPort = (): number =>
  parseInt(Deno.env.get("SERVER_PORT") ?? "8000");
