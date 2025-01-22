import { setupProd } from "./util/setup.ts";

if (import.meta.main) {
  const jobberknollAddress = "http://localhost:8000";

  const { api } = setupProd(jobberknollAddress);

  Deno.serve(
    {
      port: 8001,
      onListen: (addr) => console.log(`http://${addr.hostname}:${addr.port}`),
    },
    api.fetch,
  );
}
