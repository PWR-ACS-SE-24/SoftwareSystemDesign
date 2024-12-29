import { envProd, envServerPort } from "./app/mod.ts";
import { setupDev, setupProd } from "./setup.ts";

if (import.meta.main) {
  const { api, logger } = envProd() ? await setupProd() : setupDev();

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
