import { createRoute } from "@hono/zod-openapi";
import type { DeleteAccountUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import { UserUnauthorizedDto } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountNotFoundDto, SchemaMismatchDto } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { IdParamSchema, jsonRes } from "~/shared/openapi.ts";

export const deleteAccountRoute = createRoute({
  method: "delete",
  path: "/accounts/{id}",
  summary: "Delete an account",
  tags: ["Accounts"],
  description: "Only for admin users.",
  request: {
    headers: extHeadersSchema("admin"),
    params: IdParamSchema,
  },
  responses: {
    204: { description: "Account deleted successfully." },
    401: jsonRes(UserUnauthorizedDto, "The user does not have access to the resource."),
    404: jsonRes(AccountNotFoundDto, "The account could not be found."),
    422: jsonRes(SchemaMismatchDto, "The request data did not align with the schema."),
  },
});

export function deleteAccountHandler(deleteAccount: DeleteAccountUseCase): JkHandler<typeof deleteAccountRoute> {
  return authorize("admin", async (c) => {
    const { id: accountId } = c.req.valid("param");
    const res = await deleteAccount.invoke(c.get("ctx"), { accountId });
    return isOk(res) ? c.body(null, 204) : c.json(res.value, res.value.code);
  });
}
