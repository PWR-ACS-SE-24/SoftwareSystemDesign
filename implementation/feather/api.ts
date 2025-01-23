import { OpenAPIHono } from "@hono/zod-openapi";
import { configureDocs, createJkApp } from "@jobberknoll/api";
import { Logger } from "@jobberknoll/app";
import { JwksProvider } from "./jwks-provider/mod.ts";
import * as r from "./routes/mod.ts";
import { SERVICE_VERSION } from "./util/metadata.ts";

export function buildApi(logger: Logger, jwksProvider: JwksProvider) {
  const int = createJkApp(logger)
    .openapi(r.healthRoute, r.healthHandler(jwksProvider))
    .openapi(r.verifyRoute, r.verifyHandler(jwksProvider));

  configureDocs(int, {
    path: "/int/v1",
    title: "Feather Internal API",
    version: SERVICE_VERSION,
    description: "The internal API for JakPrzyjade auth sidecar.",
    externalDocs: {
      url: "https://github.com/PWR-ACS-SE-24/SoftwareSystemDesign",
    },
  });

  const api = new OpenAPIHono().route("/int/v1", int);

  return api;
}
