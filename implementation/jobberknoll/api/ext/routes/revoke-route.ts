import { createRoute } from "@hono/zod-openapi";
import type { RevokeUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import { UserUnauthorizedResponse } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountNotFoundResponse, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";

export const revokeRoute = createRoute({
  method: "post",
  path: "/revoke",
  summary: "Revoke all refresh tokens",
  tags: ["Auth"],
  description: "Only for authenticated users.",
  request: {
    headers: extHeadersSchema("passenger"),
  },
  responses: {
    204: { description: "Tokens revoked successfully." },
    401: UserUnauthorizedResponse,
    404: AccountNotFoundResponse, // NOTE: can be returned if the user deleted their account, but the token is still valid, or the gateway provided an invalid header
    422: SchemaMismatchResponse,
  },
});

export function revokeHandler(revoke: RevokeUseCase): JkHandler<typeof revokeRoute> {
  return authorize("member", async (c) => {
    const { "jp-user-id": accountId } = c.req.valid("header");
    const res = await revoke.invoke(c.get("ctx"), { accountId });
    return isOk(res) ? c.body(null, 204) : c.json(res.value, res.value.code);
  });
}
