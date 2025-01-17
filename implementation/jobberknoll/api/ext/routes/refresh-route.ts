import { createRoute } from "@hono/zod-openapi";
import type { RefreshUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { InvalidCredentialsResponse, RefreshTokenDto, TokensDto } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountNotFoundResponse, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { jsonReq, jsonRes } from "~/shared/openapi.ts";

export const refreshRoute = createRoute({
  method: "post",
  path: "/refresh",
  summary: "Refresh the access token",
  tags: ["Auth"],
  request: {
    headers: extHeadersSchema("guest"),
    body: jsonReq(RefreshTokenDto, "Refresh information."),
  },
  responses: {
    200: jsonRes(TokensDto, "Refresh successful."),
    403: InvalidCredentialsResponse,
    404: AccountNotFoundResponse, // NOTE: can be returned if the user deleted their account, but the token is still valid, or the gateway provided an invalid header
    422: SchemaMismatchResponse,
  },
});

export function refreshHandler(refresh: RefreshUseCase): JkHandler<typeof refreshRoute> {
  return async (c) => {
    const refreshReq = c.req.valid("json");
    const res = await refresh.invoke(c.get("ctx"), refreshReq);
    return isOk(res) ? c.json(res.value, 200) : c.json(res.value, res.value.code);
  };
}
