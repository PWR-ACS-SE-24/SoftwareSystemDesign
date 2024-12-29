import { envServerPort } from "./app/mod.ts";
import { setupProd } from "./setup.ts";

if (import.meta.main) {
  const { api, logger } = setupProd();

  Deno.serve(
    {
      port: envServerPort(),
      onListen: (addr) =>
        logger.info(null, "listen", {
          addr: `http://${addr.hostname}:${addr.port}`,
        }),
    },
    api.fetch,
  );
}
