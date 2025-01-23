import { createRoute } from "@hono/zod-openapi";
import { HealthDto, IntHeadersSchema, JkHandler, jsonRes } from "@jobberknoll/api";
import { JwksProvider } from "../jwks-provider/mod.ts";

export const healthRoute = createRoute({
  method: "get",
  path: "/health",
  summary: "Get service health status",
  tags: ["Sidecar"],
  description:
    "The downstream clients should also gracefully handle failing requests to this endpoint and treat the service as unhealthy.",
  request: {
    headers: IntHeadersSchema,
  },
  responses: {
    200: jsonRes(HealthDto, "Retrieved service health, service is healthy."),
    503: jsonRes(HealthDto, "Retrieved service health, service is unhealthy."),
  },
});

export function healthHandler(
  jwksProvider: JwksProvider,
): JkHandler<typeof healthRoute> {
  return async (c) => {
    const jwksProviderHealth = await jwksProvider.health();
    const serviceHealth = {
      status: jwksProviderHealth.status,
      components: {
        jwksProvider: jwksProviderHealth,
      },
    };
    const code = serviceHealth.status === "UP" ? 200 : 503;
    return c.json(serviceHealth, code);
  };
}
