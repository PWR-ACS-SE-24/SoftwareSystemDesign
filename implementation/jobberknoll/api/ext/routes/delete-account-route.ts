import { createRoute } from "@hono/zod-openapi";
import type { DeleteAccountUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import { UserUnauthorizedResponse } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountNotFoundResponse, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { IdParamSchema } from "~/shared/openapi.ts";

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
    401: UserUnauthorizedResponse,
    404: AccountNotFoundResponse,
    422: SchemaMismatchResponse,
  },
});

export function deleteAccountHandler(deleteAccount: DeleteAccountUseCase): JkHandler<typeof deleteAccountRoute> {
  return authorize("admin", async (c) => {
    const { id: accountId } = c.req.valid("param");
    const res = await deleteAccount.invoke(c.get("ctx"), { accountId });
    return isOk(res) ? c.body(null, 204) : c.json(res.value, res.value.code);
  });
}
