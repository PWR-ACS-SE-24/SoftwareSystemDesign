import { setupProd } from "./setup.ts";

if (import.meta.main) {
  const { app, logger } = setupProd();
  // TODO @tchojnacki: Support passing PORT from env variables
  // TODO @tchojnacki: Set up Dockerfile and compose.yml
  // TODO @tchojnacki: Set up CI/CD
  Deno.serve(
    { onListen: (addr) => logger.info(null, "listen", { addr }) },
    app.fetch,
  );
}
