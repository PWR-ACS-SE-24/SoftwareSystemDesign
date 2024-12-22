import { swaggerUI } from "@hono/swagger-ui";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";

type SetupDocsOptions = {
  prefix: string;
  title: string;
  version: string;
  description?: string;
  externalDocs?: { url: string };
};

export function configureDocs(
  app: OpenAPIHono,
  { prefix, title, version, description, externalDocs }: SetupDocsOptions,
) {
  app.get("/docs", (c) =>
    c.json(
      {
        openapi: `${c.req.url}/openapi.json`,
        swagger: `${c.req.url}/swagger`,
        scalar: `${c.req.url}/scalar`,
      },
      200,
    ));

  app.doc("/docs/openapi.json", (c) => ({
    openapi: "3.0.0",
    info: {
      title,
      version,
      description,
    },
    externalDocs,
    servers: [{ url: new URL(c.req.url).origin + prefix }],
  }));

  app.get("/docs/swagger", swaggerUI({ url: `${prefix}/docs/openapi.json` }));

  app.get(
    "/docs/scalar",
    apiReference({
      spec: { url: `${prefix}/docs/openapi.json` },
      theme: "kepler",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
      hideClientButton: true,
    }),
  );
}
