import { createRoute } from "@hono/zod-openapi";
import type { EditAccountPasswordUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import { EditAccountPasswordDto, InvalidAccountDataResponse, UserUnauthorizedResponse } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountNotFoundResponse, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { jsonReq } from "~/shared/openapi.ts";

export const editSelfPasswordRoute = createRoute({
  method: "put",
  path: "/self/password",
  summary: "Edit your own password",
  tags: ["Self"],
  description: "Only for authenticated users.",
  request: {
    headers: extHeadersSchema("passenger"),
    body: jsonReq(EditAccountPasswordDto, "Information about the password edit."),
  },
  responses: {
    204: { description: "Password updated successfully." },
    400: InvalidAccountDataResponse,
    401: UserUnauthorizedResponse,
    404: AccountNotFoundResponse, // NOTE: can be returned if the user deleted their account, but the token is still valid, or the gateway provided an invalid header
    422: SchemaMismatchResponse,
  },
});

export function editSelfPasswordHandler(
  editAccountPassword: EditAccountPasswordUseCase,
): JkHandler<typeof editSelfPasswordRoute> {
  return authorize("member", async (c) => {
    const { "jp-user-id": accountId } = c.req.valid("header");
    const { oldPassword, newPassword } = c.req.valid("json");
    const res = await editAccountPassword.invoke(c.get("ctx"), { accountId, oldPassword, newPassword });
    return isOk(res) ? c.body(null, 204) : c.json(res.value, res.value.code);
  });
}
