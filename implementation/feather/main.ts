import { envJobberknollAddress, envServerPort, logEnvironment } from "./util/env.ts";
import { setupProd } from "./util/setup.ts";

if (import.meta.main) {
  const { api, logger } = setupProd(envJobberknollAddress());

  logEnvironment(logger);

  Deno.serve(
    {
      port: envServerPort(),
      onListen: (addr) => logger.info(null, "listen", { host: `http://${addr.hostname}:${addr.port}` }),
    },
    api.fetch,
  );
}
