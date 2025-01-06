import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import type { GetAccountByIdUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { IntHeadersSchema } from "~/int/openapi.ts";
import { AccountDto, AccountNotFoundDto, SchemaMismatchDto } from "~/shared/contracts/mod.ts";
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
    404: jsonRes(AccountNotFoundDto, "The account could not be found."),
    422: jsonRes(SchemaMismatchDto, "The request data did not align with the schema."),
  },
});

export function getAccountByIdHandler(getAccountById: GetAccountByIdUseCase): RouteHandler<typeof getAccountByIdRoute> {
  return async (c) => {
    const { "jp-request-id": requestId } = c.req.valid("header");
    const { id: accountId } = c.req.valid("param");
    const res = await getAccountById.invoke({ requestId }, { accountId });
    return isOk(res) ? c.json(mapAccountToDto(res.value), 200) : c.json(res.value, res.value.code);
  };
}
