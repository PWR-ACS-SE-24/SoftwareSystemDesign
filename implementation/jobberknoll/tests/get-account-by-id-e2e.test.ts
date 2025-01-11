import { newCtx } from "@jobberknoll/app";
import { accountMock, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals, assertObjectMatch } from "@std/assert";
import { setupTest } from "../setup.ts";

Deno.test("GET /int/v1/accounts/{id} should return an account if it exists", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request(`/int/v1/accounts/${accountMock.id}`);
  const body = await response.json();

  assertEquals(response.status, 200);
  assertObjectMatch(accountMock, body);
  assert(!("hashedPassword" in body));
  assert(!("lastModified" in body));
});

Deno.test("GET /int/v1/accounts/{id} should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request(`/int/v1/accounts/${uuid()}`);
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});

Deno.test("GET /int/v1/accounts/{id} should return schema-mismatch if the account id is not an UUID", async () => {
  const { api } = await setupTest();

  const response = await api.request("/int/v1/accounts/123");
  const body = await response.json();

  assertEquals(response.status, 422);
  assertEquals(body.kind, "schema-mismatch");
});

const correctHeaders = {
  "jp-user-id": uuid(),
  "jp-user-role": "admin",
  "jp-request-id": uuid(),
  "user-agent": "Phoenix/1.0.0",
};

Deno.test(
  "GET /ext/v1/accounts/{id} should return an account if it exists",
  async () => {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request(`/ext/v1/accounts/${accountMock.id}`, { headers: correctHeaders });
    const body = await response.json();

    assertEquals(response.status, 200);
    assertEquals(body.id, accountMock.id);
    assertEquals(body.type, accountMock.type);
    assertEquals(body.fullName, accountMock.fullName);
    assertEquals(body.email, accountMock.email);
    assert(!("hashedPassword" in body));
    assert(!("lastModified" in body));
  },
);

Deno.test("GET /ext/v1/accounts/{id} should return user-unauthorized if user is not an admin", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request(`/ext/v1/accounts/${accountMock.id}`, {
    headers: { ...correctHeaders, "jp-user-role": "passenger" },
  });
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(body.kind, "user-unauthorized");
});

Deno.test("GET /ext/v1/accounts/{id} should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request(`/ext/v1/accounts/${uuid()}`, { headers: correctHeaders });
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});

Deno.test("GET /ext/v1/accounts/{id} should return schema-mismatch if the account id is not an UUID", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/accounts/123", { headers: correctHeaders });
  const body = await response.json();

  assertEquals(response.status, 422);
  assertEquals(body.kind, "schema-mismatch");
});
