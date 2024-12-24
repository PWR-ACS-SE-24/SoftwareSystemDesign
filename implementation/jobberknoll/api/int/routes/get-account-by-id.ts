import { createRoute, type RouteHandler } from "@hono/zod-openapi";
import { accountNotFoundError } from "@jobberknoll/core/domain";
import {
  AccountDto,
  AccountNotFoundDto,
  SchemaMismatchDto,
} from "~/shared/contracts/mod.ts";
import { IdParamSchema, jsonRes } from "~/shared/openapi.ts";

export const getAccountByIdRoute = createRoute({
  method: "get",
  path: "/accounts/{id}",
  summary: "Get account by ID",
  tags: ["Accounts"],
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: jsonRes(AccountDto, "Retrieved account by ID."),
    404: jsonRes(AccountNotFoundDto, "The account could not be found."),
    422: jsonRes(
      SchemaMismatchDto,
      "The request data did not align with the schema.",
    ),
  },
});

export function getAccountByIdHandler(): RouteHandler<
  typeof getAccountByIdRoute
> {
  return (c) => c.json(accountNotFoundError(c.req.valid("param").id), 404);
}
