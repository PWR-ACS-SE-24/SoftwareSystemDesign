import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import { jsonRes } from "~/shared/openapi.ts";
import { HealthDto } from "../contracts/health-dto.ts";

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

export function getHealthHandler(): RouteHandler<typeof getHealthRoute> {
  // TODO @tchojnacki: Extract this logic to the application layer
  return (c) => c.json({ status: "UP" as const }, 200);
}
