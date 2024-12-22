import { createRoute } from "@hono/zod-openapi";
import { jsonResponse } from "../../helpers/openapi.ts";
import { HealthDto } from "../dtos/health-dto.ts";

export const getHealth = createRoute({
  method: "get",
  path: "/health",
  summary: "Get service health status",
  tags: ["Monitoring"],
  description:
    "The downstream clients should also gracefully handle failing requests to this endpoint and treat the service as unhealthy.",
  responses: {
    200: jsonResponse(
      HealthDto,
      "Successfully retrieved service health status.",
    ),
  },
});
