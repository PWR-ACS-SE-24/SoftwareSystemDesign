import { envPort } from "./app/mod.ts";
import { setupProd } from "./setup.ts";

if (import.meta.main) {
  const { app, logger } = setupProd();
  // TODO @tchojnacki: Set up Dockerfile and compose.yml
  // TODO @tchojnacki: Set up CI/CD
  Deno.serve(
    {
      port: envPort(),
      onListen: (addr) => logger.info(null, "listen", { addr }),
    },
    app.fetch,
  );
}
