import { newCtx, type UserRole } from "@jobberknoll/app";
import { accountMock, NIL_UUID, type UUID, uuid } from "@jobberknoll/core/shared";
import { assertEquals } from "@std/assert/equals";
import { setupTest } from "../setup.ts";

function headers(userId: UUID, role: UserRole) {
  return {
    "jp-user-id": userId,
    "jp-user-role": role,
    "jp-request-id": uuid(),
    "user-agent": "Phoenix/1.0.0",
  };
}

Deno.test("DELETE /ext/v1/self should delete the account in the happy path", async () => {
  for (const role of ["admin", "driver", "inspector", "passenger"] as const) {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request(
      "/ext/v1/self",
      { method: "DELETE", headers: headers(accountMock.id, role) },
    );

    assertEquals(response.status, 204);
  }
});

Deno.test("DELETE /ext/v1/self should make GET /ext/v1/self return account-not-found", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  await api.request(
    "/ext/v1/self",
    { method: "DELETE", headers: headers(accountMock.id, "passenger") },
  );

  const response = await api.request("/ext/v1/self", { headers: headers(accountMock.id, "passenger") });
  const body = await response.json();
  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});

Deno.test("DELETE /ext/v1/self should return user-unauthorized if the user is a guest", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self", { method: "DELETE", headers: headers(NIL_UUID, "guest") });
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(body.kind, "user-unauthorized");
});

Deno.test("DELETE /ext/v1/self should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self", { method: "DELETE", headers: headers(uuid(), "passenger") });
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});
