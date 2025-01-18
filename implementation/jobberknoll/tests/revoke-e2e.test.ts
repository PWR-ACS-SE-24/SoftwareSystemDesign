import { newCtx, type UserRole } from "@jobberknoll/app";
import { accountMock, type UUID, uuid } from "@jobberknoll/core/shared";
import { assertEquals } from "@std/assert";
import { setupTest } from "../setup.ts";

function headers(userId: UUID, role: UserRole) {
  return {
    "content-type": "application/json",
    "jp-user-id": userId,
    "jp-user-role": role,
    "jp-request-id": uuid(),
    "user-agent": "Phoenix/1.0.0",
  };
}

Deno.test("POST /ext/v1/revoke should revoke the token in the happy path", async () => {
  for (const role of ["admin", "driver", "inspector", "passenger"] as const) {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request("/ext/v1/revoke", {
      method: "POST",
      headers: headers(accountMock.id, role),
    });

    assertEquals(response.status, 204);
  }
});

Deno.test("POST /ext/v1/revoke should return user-unauthorized if the user is a guest", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/revoke", {
    method: "POST",
    headers: headers(uuid(), "guest"),
  });
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(body.kind, "user-unauthorized");
});

Deno.test("POST /ext/v1/revoke should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/revoke", {
    method: "POST",
    headers: headers(uuid(), "passenger"),
  });
  const resBody = await response.json();

  assertEquals(response.status, 404);
  assertEquals(resBody.kind, "account-not-found");
});
