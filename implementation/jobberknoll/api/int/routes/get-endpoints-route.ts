import { createRoute } from "@hono/zod-openapi";
import type { UserRole } from "@jobberknoll/app";
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

const MEMBER = ["admin", "driver", "inspector", "passenger"] as UserRole[];

export function getEndpointsHandler(): JkHandler<typeof getEndpointsRoute> {
  return (c) =>
    // TODO: make sure it is up to date
    c.json([
      { method: "POST", path: "/ext/v1/register", roles: [] },
      { method: "POST", path: "/ext/v1/revoke", roles: MEMBER },
      { method: "GET", path: "/ext/v1/self", roles: MEMBER },
      { method: "PUT", path: "/ext/v1/self/name", roles: MEMBER },
      { method: "PUT", path: "/ext/v1/self/password", roles: MEMBER },
      { method: "PUT", path: "/ext/v1/self/phone", roles: ["passenger"] },
      { method: "DELETE", path: "/ext/v1/self", roles: MEMBER },
      { method: "GET", path: "/ext/v1/accounts", roles: ["admin"] },
      { method: "POST", path: "/ext/v1/accounts", roles: ["admin"] },
      { method: "GET", path: "/ext/v1/accounts/:id", roles: ["admin"] },
      { method: "DELETE", path: "/ext/v1/accounts", roles: ["admin"] },
    ]);
}
