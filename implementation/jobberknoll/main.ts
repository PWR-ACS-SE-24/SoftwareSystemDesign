import { envPort } from "./app/mod.ts";
import { setupProd } from "./setup.ts";

if (import.meta.main) {
  const { app, logger } = setupProd();

  Deno.serve(
    {
      port: envPort(),
      onListen: (addr) =>
        logger.info(null, "listen", {
          addr: `http://${addr.hostname}:${addr.port}`,
        }),
    },
    app.fetch,
  );
}
