import { createRoute } from "@hono/zod-openapi";
import type { GetHealthUseCase } from "@jobberknoll/app";
import { expect } from "@jobberknoll/core/shared";
import { IntHeadersSchema } from "~/int/openapi.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { jsonRes } from "~/shared/openapi.ts";
import { HealthDto } from "../contracts/mod.ts";

export const getHealthRoute = createRoute({
  method: "get",
  path: "/health",
  summary: "Get service health status",
  tags: ["Monitoring"],
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

export function getHealthHandler(getHealth: GetHealthUseCase): JkHandler<typeof getHealthRoute> {
  return async (c) => {
    const serviceHealth = expect(await getHealth.invoke(c.get("ctx"), null), "getHealth request should never fail");
    const code = ["UP", "UNKNOWN"].includes(serviceHealth.status) ? 200 : 503;
    return c.json(serviceHealth, code);
  };
}
