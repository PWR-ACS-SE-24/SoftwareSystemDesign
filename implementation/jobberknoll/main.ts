import { envProd, envServerPort, logEnvironment } from "./app/mod.ts";
import { setupDev, setupProd } from "./setup.ts";

if (import.meta.main) {
  const { api, logger } = envProd() ? await setupProd() : await setupDev();

  logEnvironment(logger);

  Deno.serve(
    {
      port: envServerPort(),
      onListen: (addr) => logger.info(null, "listen", { host: `http://${addr.hostname}:${addr.port}` }),
    },
    api.fetch,
  );
}
