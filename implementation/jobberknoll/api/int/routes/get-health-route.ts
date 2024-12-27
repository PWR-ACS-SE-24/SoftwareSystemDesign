import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import type { GetHealthUseCase } from "@jobberknoll/app";
import { expect, uuid } from "@jobberknoll/core/shared";
import { jsonRes } from "~/shared/openapi.ts";
import { HealthDto } from "../contracts/mod.ts";

export const getHealthRoute = createRoute({
  method: "get",
  path: "/health",
  summary: "Get service health status",
  tags: ["Monitoring"],
  description:
    "The downstream clients should also gracefully handle failing requests to this endpoint and treat the service as unhealthy.",
  responses: {
    200: jsonRes(
      HealthDto,
      "Retrieved service health, service is healthy.",
    ),
    503: jsonRes(
      HealthDto,
      "Retrieved service health, service is unhealthy.",
    ),
  },
});

export function getHealthHandler(
  getHealth: GetHealthUseCase,
): RouteHandler<typeof getHealthRoute> {
  return async (c) => {
    const serviceHealth = expect(
      await getHealth.invoke(null, uuid()),
      "service health request should never fail",
    );
    const code = ["UP", "UNKNOWN"].includes(serviceHealth.status) ? 200 : 503;
    return c.json(serviceHealth, code);
  };
}
