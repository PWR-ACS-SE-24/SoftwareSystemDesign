import { createRoute } from "@hono/zod-openapi";
import type { GetAccountByIdUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import { UserUnauthorizedResponse } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountDto, AccountNotFoundResponse, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { mapAccountToDto } from "~/shared/mappers/mod.ts";
import { jsonRes } from "~/shared/openapi.ts";

export const getSelfRoute = createRoute({
  method: "get",
  path: "/self",
  summary: "Get your own account",
  tags: ["Self"],
  description: "Only for authenticated users.",
  request: {
    headers: extHeadersSchema("passenger"),
  },
  responses: {
    200: jsonRes(AccountDto, "Retrieved your own account."),
    401: UserUnauthorizedResponse,
    404: AccountNotFoundResponse, // NOTE: can be returned if the user deleted their account, but the token is still valid, or the gateway provided an invalid header
    422: SchemaMismatchResponse,
  },
});

export function getSelfHandler(getAccountById: GetAccountByIdUseCase): JkHandler<typeof getSelfRoute> {
  return authorize("member", async (c) => {
    const { "jp-user-id": accountId } = c.req.valid("header");
    const res = await getAccountById.invoke(c.get("ctx"), { accountId });
    return isOk(res) ? c.json(mapAccountToDto(res.value), 200) : c.json(res.value, res.value.code);
  });
}
