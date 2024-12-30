import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import type { CreateAccountUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import {
  CreateAccountDto,
  InvalidAccountDataDto,
  UserUnauthorizedDto,
} from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountDto, SchemaMismatchDto } from "~/shared/contracts/mod.ts";
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
    400: jsonRes(
      InvalidAccountDataDto,
      "Some of the provided account data is invalid.",
    ),
    401: jsonRes(
      UserUnauthorizedDto,
      "The user does not have access to the resource.",
    ),
    422: jsonRes(
      SchemaMismatchDto,
      "The request data did not align with the schema.",
    ),
  },
});

export function createAccountHandler(
  createAccount: CreateAccountUseCase,
): RouteHandler<typeof createAccountRoute> {
  return authorize("admin", async (c) => {
    const { "jp-request-id": requestId } = c.req.valid("header");
    const createAccountReq = c.req.valid("json");
    const res = await createAccount.invoke(createAccountReq, requestId);
    return isOk(res)
      ? c.json(mapAccountToDto(res.value), 201)
      : c.json(res.value, res.value.code);
  });
}
