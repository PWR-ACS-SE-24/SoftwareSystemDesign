import { OpenAPIHono } from "@hono/zod-openapi";
import { configureDocs } from "@jobberknoll/api";
import { JwksProvider } from "./jwks-provider/mod.ts";
import { healthHandler, healthRoute } from "./routes/mod.ts";
import { SERVICE_VERSION } from "./util/metadata.ts";

export function buildApi(jwksProvider: JwksProvider) {
  const int = new OpenAPIHono().openapi(
    healthRoute,
    healthHandler(jwksProvider)
  );

  configureDocs(int, {
    path: "/int/v1",
    title: "Feather Internal API",
    version: SERVICE_VERSION,
    description: "The internal API for JakPrzyjade account management.",
    externalDocs: {
      url: "https://github.com/PWR-ACS-SE-24/SoftwareSystemDesign",
    },
  });

  const api = new OpenAPIHono().route("/int/v1", int);

  return api;
}
