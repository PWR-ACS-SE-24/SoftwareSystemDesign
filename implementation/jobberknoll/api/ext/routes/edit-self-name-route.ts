import { createRoute } from "@hono/zod-openapi";
import type { EditAccountNameUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import { EditAccountNameDto, UserUnauthorizedResponse } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountNotFoundResponse, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { jsonReq } from "~/shared/openapi.ts";

export const editSelfNameRoute = createRoute({
  method: "put",
  path: "/self/name",
  summary: "Edit your own name",
  tags: ["Self"],
  description: "Only for authenticated users.",
  request: {
    headers: extHeadersSchema("passenger"),
    body: jsonReq(EditAccountNameDto, "Information about the name edit."),
  },
  responses: {
    204: { description: "Full name updated successfully." },
    401: UserUnauthorizedResponse,
    404: AccountNotFoundResponse, // NOTE: can be returned if the user deleted their account, but the token is still valid, or the gateway provided an invalid header
    422: SchemaMismatchResponse,
  },
});

export function editSelfNameHandler(editAccountName: EditAccountNameUseCase): JkHandler<typeof editSelfNameRoute> {
  return authorize("member", async (c) => {
    const { "jp-user-id": accountId } = c.req.valid("header");
    const { fullName } = c.req.valid("json");
    const res = await editAccountName.invoke(c.get("ctx"), { accountId, fullName });
    return isOk(res) ? c.body(null, 204) : c.json(res.value, res.value.code);
  });
}
