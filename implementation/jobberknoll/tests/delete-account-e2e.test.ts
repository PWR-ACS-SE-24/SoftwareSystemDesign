import { accountMock, uuid } from "@jobberknoll/core/shared";
import { assertEquals } from "@std/assert/equals";
import { newCtx } from "../app/shared/ctx.ts";
import { setupTest } from "../setup.ts";

const correctHeaders = {
  "jp-user-id": uuid(),
  "jp-user-role": "admin",
  "jp-request-id": uuid(),
  "user-agent": "Phoenix/1.0.0",
};

Deno.test("DELETE /ext/v1/accounts/{id} should delete the account if it exists", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request(
    `/ext/v1/accounts/${accountMock.id}`,
    { method: "DELETE", headers: correctHeaders },
  );
  const body = await response.text();

  assertEquals(response.status, 204);
  assertEquals(body, "");
});

Deno.test("DELETE /ext/v1/accounts/{id} should return user-unauthorized if user is not an admin", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request(`/ext/v1/accounts/${accountMock.id}`, {
    method: "DELETE",
    headers: { ...correctHeaders, "jp-user-role": "passenger" },
  });
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(body.kind, "user-unauthorized");
});

Deno.test("DELETE /ext/v1/accounts/{id} should return schema-mismatch if the account id is not an UUID", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/accounts/123", { method: "DELETE", headers: correctHeaders });
  const body = await response.json();

  assertEquals(response.status, 422);
  assertEquals(body.kind, "schema-mismatch");
});

Deno.test("DELETE /ext/v1/accounts/{id} should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request(`/ext/v1/accounts/${uuid()}`, { method: "DELETE", headers: correctHeaders });
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});

Deno.test("DELETE /ext/v1/accounts/{id} should make the account unfetchable from GET /ext/v1/accounts/{id}", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  await api.request(`/ext/v1/accounts/${accountMock.id}`, { method: "DELETE", headers: correctHeaders });

  const response = await api.request(`/ext/v1/accounts/${accountMock.id}`, { headers: correctHeaders });
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});
