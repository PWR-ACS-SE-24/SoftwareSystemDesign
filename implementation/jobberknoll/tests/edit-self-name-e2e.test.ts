import { newCtx, UserRole } from "@jobberknoll/app";
import { accountMock, NIL_UUID, UUID, uuid } from "@jobberknoll/core/shared";
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

Deno.test("PUT /ext/v1/self/name should edit the account name in the happy path", async () => {
  for (const role of ["admin", "driver", "inspector", "passenger"] as const) {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request("/ext/v1/self/name", {
      method: "PUT",
      headers: headers(accountMock.id, role),
      body: JSON.stringify({ fullName: "New Name" }),
    });

    assertEquals(response.status, 204);
  }
});

Deno.test("PUT /ext/v1/self/name should be reflected in GET /ext/v1/self", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  await api.request("/ext/v1/self/name", {
    method: "PUT",
    headers: headers(accountMock.id, "passenger"),
    body: JSON.stringify({ fullName: "New Name" }),
  });

  const response = await api.request("/ext/v1/self", { headers: headers(accountMock.id, "passenger") });
  const body = await response.json();
  assertEquals(body.fullName, "New Name");
});

Deno.test("PUT /ext/v1/self/name should return user-unauthorized if the user is a guest", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self/name", {
    method: "PUT",
    headers: headers(NIL_UUID, "guest"),
    body: JSON.stringify({ fullName: "New Name" }),
  });
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(body.kind, "user-unauthorized");
});

Deno.test("PUT /ext/v1/self/name should return schema-mismatch if the body is invalid", async () => {
  for (const reqBody of [{}, { name: "XYZ" }, { fullName: 15 }, { fullName: "" }]) {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request("/ext/v1/self/name", {
      method: "PUT",
      headers: headers(accountMock.id, "passenger"),
      body: JSON.stringify(reqBody),
    });
    const resBody = await response.json();

    assertEquals(response.status, 422);
    assertEquals(resBody.kind, "schema-mismatch");
  }
});

Deno.test("PUT /ext/v1/self/name should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self/name", {
    method: "PUT",
    headers: headers(uuid(), "passenger"),
    body: JSON.stringify({ fullName: "New Name" }),
  });
  const resBody = await response.json();

  assertEquals(response.status, 404);
  assertEquals(resBody.kind, "account-not-found");
});
