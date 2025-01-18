import { createRoute } from "@hono/zod-openapi";
import type { GetJwksUseCase } from "@jobberknoll/app";
import { expect } from "@jobberknoll/core/shared";
import { JwksDto } from "~/int/contracts/mod.ts";
import { IntHeadersSchema } from "~/int/openapi.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { jsonRes } from "~/shared/openapi.ts";

export const getJwksRoute = createRoute({
  method: "get",
  path: "/jwks",
  summary: "Get the JSON Web Key Set",
  tags: ["Auth"],
  request: {
    headers: IntHeadersSchema,
  },
  responses: {
    200: jsonRes(JwksDto, "Retrieved the JSON Web Key Set."),
  },
});

export function getJwksHandler(getJwks: GetJwksUseCase): JkHandler<typeof getJwksRoute> {
  return async (c) => {
    const jwks = expect(await getJwks.invoke(c.get("ctx"), null), "getJwks request should never fail");
    return c.json(jwks, 200);
  };
}
