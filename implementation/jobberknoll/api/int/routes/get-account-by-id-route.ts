import { createRoute } from "@hono/zod-openapi";
import type { GetAccountByIdUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { IntHeadersSchema } from "~/int/openapi.ts";
import { AccountDto, AccountNotFoundResponse, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { mapAccountToDto } from "~/shared/mappers/mod.ts";
import { IdParamSchema, jsonRes } from "~/shared/openapi.ts";

export const getAccountByIdRoute = createRoute({
  method: "get",
  path: "/accounts/{id}",
  summary: "Get account by ID",
  tags: ["Accounts"],
  request: {
    headers: IntHeadersSchema,
    params: IdParamSchema,
  },
  responses: {
    200: jsonRes(AccountDto, "Retrieved account by ID."),
    404: AccountNotFoundResponse,
    422: SchemaMismatchResponse,
  },
});

export function getAccountByIdHandler(getAccountById: GetAccountByIdUseCase): JkHandler<typeof getAccountByIdRoute> {
  return async (c) => {
    const { id: accountId } = c.req.valid("param");
    const res = await getAccountById.invoke(c.get("ctx"), { accountId });
    return isOk(res) ? c.json(mapAccountToDto(res.value), 200) : c.json(res.value, res.value.code);
  };
}
