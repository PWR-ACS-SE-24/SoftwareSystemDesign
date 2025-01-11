import { createRoute } from "@hono/zod-openapi";
import type { EditAccountPhoneUseCase } from "@jobberknoll/app";
import { isOk } from "@jobberknoll/core/shared";
import { authorize } from "~/ext/authorization.ts";
import { EditAccountPhoneDto, UserUnauthorizedResponse } from "~/ext/contracts/mod.ts";
import { extHeadersSchema } from "~/ext/openapi.ts";
import { AccountNotFoundResponse, SchemaMismatchResponse } from "~/shared/contracts/mod.ts";
import type { JkHandler } from "~/shared/hooks.ts";
import { jsonReq } from "~/shared/openapi.ts";

export const editSelfPhoneRoute = createRoute({
  method: "put",
  path: "/self/phone",
  summary: "Edit your own phone",
  tags: ["Self"],
  description: "Only for passenger users.",
  request: {
    headers: extHeadersSchema("passenger"),
    body: jsonReq(EditAccountPhoneDto, "Information about the phone edit."),
  },
  responses: {
    204: { description: "Phone number updated successfully." },
    401: UserUnauthorizedResponse,
    404: AccountNotFoundResponse, // NOTE: can be returned if the user deleted their account, but the token is still valid, or the gateway provided an invalid header
    422: SchemaMismatchResponse,
  },
});

export function editSelfPhoneHandler(editAccountPhone: EditAccountPhoneUseCase): JkHandler<typeof editSelfPhoneRoute> {
  return authorize("passenger", async (c) => {
    const { "jp-user-id": accountId } = c.req.valid("header");
    const { phoneNumber } = c.req.valid("json");
    const res = await editAccountPhone.invoke(c.get("ctx"), { accountId, phoneNumber });
    return isOk(res) ? c.body(null, 204) : c.json(res.value, res.value.code);
  });
}
