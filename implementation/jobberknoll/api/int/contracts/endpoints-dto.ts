import { z } from "@hono/zod-openapi";
import { USER_ROLES } from "../../../app/mod.ts";

const Endpoint = z.object({
  // NOTE: this is only a subset of the HTTP methods, but only these will be ever used in the service
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).openapi({
    description: "HTTP method name.",
    examples: ["GET", "POST", "PUT", "DELETE"],
  }),
  path: z.string().startsWith("/ext/").openapi({
    description: "Path of the endpoint.",
    examples: ["/ext/v1/accounts"],
  }),
  roles: z.array(z.enum(USER_ROLES)).openapi({
    description: "Roles required to access the endpoint.",
    examples: [["admin", "driver", "passenger", "inspector"]],
  }),
});

export const EndpointsDto = z.array(Endpoint).openapi("EndpointsDto", {
  description: "List of external endpoints.",
  examples: [
    [
      { method: "GET", path: "/ext/v1/self", roles: ["admin", "driver", "passenger", "inspector"] },
      { method: "PUT", path: "/ext/v1/self/phone", roles: ["passenger"] },
    ],
  ],
});

export type EndpointsDto = z.infer<typeof EndpointsDto>;
