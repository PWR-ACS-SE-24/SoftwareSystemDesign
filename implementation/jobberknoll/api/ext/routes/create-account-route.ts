import { createRoute } from "@hono/zod-openapi";
import type { CreateAccountUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import { CreateAccountDto, InvalidAccountDataResponse, UserUnauthorizedResponse } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountDto, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { mapAccountToDto } from "~/shared/mappers/mod.ts";
import { jsonReq, jsonRes } from "~/shared/openapi.ts";

export const createAccountRoute = createRoute({
  method: "post",
  path: "/accounts",
  summary: "Create a new account",
  tags: ["Accounts"],
  description: "Only for admin users.",
  request: {
    headers: extHeadersSchema("admin"),
    body: jsonReq(CreateAccountDto, "Information about the created account."),
  },
  responses: {
    201: jsonRes(AccountDto, "Created a new account."),
    400: InvalidAccountDataResponse,
    401: UserUnauthorizedResponse,
    422: SchemaMismatchResponse,
  },
});

export function createAccountHandler(createAccount: CreateAccountUseCase): JkHandler<typeof createAccountRoute> {
  return authorize("admin", async (c) => {
    const createAccountReq = c.req.valid("json");
    const res = await createAccount.invoke(c.get("ctx"), createAccountReq);
    return isOk(res) ? c.json(mapAccountToDto(res.value), 201) : c.json(res.value, res.value.code);
  });
}
