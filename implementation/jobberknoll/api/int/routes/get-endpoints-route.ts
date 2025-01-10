import { createRoute } from "@hono/zod-openapi";
import { EndpointsDto } from "~/int/contracts/mod.ts";
import { IntHeadersSchema } from "~/int/openapi.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { jsonRes } from "~/shared/openapi.ts";

export const getEndpointsRoute = createRoute({
  method: "get",
  path: "/endpoints",
  summary: "Get external endpoints",
  tags: ["Monitoring"],
  request: {
    headers: IntHeadersSchema,
  },
  responses: {
    200: jsonRes(EndpointsDto, "Retrieved external endpoints."),
  },
});

export function getEndpointsHandler(): JkHandler<typeof getEndpointsRoute> {
  return (c) =>
    c.json([
      { method: "POST", path: "/ext/v1/accounts", roles: ["admin"] },
      { method: "GET", path: "/ext/v1/accounts/:id", roles: ["admin"] },
      { method: "DELETE", path: "/ext/v1/accounts", roles: ["admin"] },
    ]);
}
