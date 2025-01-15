import { setupDev } from "./setup.ts";

if (import.meta.main) {
  const { api } = setupDev();

  Deno.serve(
    {
      port: 8001,
      onListen: (addr) => console.log(`http://${addr.hostname}:${addr.port}`),
    },
    api.fetch
  );
}
