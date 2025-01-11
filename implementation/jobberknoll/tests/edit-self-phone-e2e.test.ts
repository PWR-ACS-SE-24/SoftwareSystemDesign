import { newCtx, UserRole } from "@jobberknoll/app";
import { accountMock, UUID, uuid } from "@jobberknoll/core/shared";
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

Deno.test("PUT /ext/v1/self/phone should edit the account phone if it exists", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request("/ext/v1/self/phone", {
    method: "PUT",
    headers: headers(accountMock.id, "passenger"),
    body: JSON.stringify({ phoneNumber: "123 456 789" }),
  });

  assertEquals(response.status, 204);
});

Deno.test("PUT /ext/v1/self/phone should be reflected in GET /ext/v1/self", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  await api.request("/ext/v1/self/phone", {
    method: "PUT",
    headers: headers(accountMock.id, "passenger"),
    body: JSON.stringify({ phoneNumber: "123 456 789" }),
  });

  const response = await api.request("/ext/v1/self", { headers: headers(accountMock.id, "passenger") });
  const body = await response.json();
  assertEquals(body.phoneNumber, "123 456 789");
});

for (const role of ["guest", "admin", "driver", "inspector"] as const) {
  Deno.test(`PUT /ext/v1/self/phone should return user-unauthorized if the user is a ${role}`, async () => {
    const { api } = await setupTest();

    const response = await api.request("/ext/v1/self/phone", {
      method: "PUT",
      headers: headers(uuid(), role),
      body: JSON.stringify({ phoneNumber: "123 456 789" }),
    });
    const body = await response.json();

    assertEquals(response.status, 401);
    assertEquals(body.kind, "user-unauthorized");
  });
}

Deno.test("PUT /ext/v1/self/phone should return schema-mismatch if the body is invalid", async () => {
  for (const reqBody of [{}, { phone: "123456789" }, { phoneNumber: 123456789 }, { phoneNumber: "ABCD" }]) {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request("/ext/v1/self/phone", {
      method: "PUT",
      headers: headers(accountMock.id, "passenger"),
      body: JSON.stringify(reqBody),
    });
    const body = await response.json();

    assertEquals(response.status, 422);
    assertEquals(body.kind, "schema-mismatch");
  }
});

Deno.test("PUT /ext/v1/self/phone should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self/phone", {
    method: "PUT",
    headers: headers(uuid(), "passenger"),
    body: JSON.stringify({ phoneNumber: "123 456 789" }),
  });
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});
