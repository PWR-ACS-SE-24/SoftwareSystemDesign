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

Deno.test("PUT /ext/v1/self/password should edit the account password in the happy path", async () => {
  for (const role of ["admin", "driver", "inspector", "passenger"] as const) {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request("/ext/v1/self/password", {
      method: "PUT",
      headers: headers(accountMock.id, role),
      body: JSON.stringify({ oldPassword: accountMock.hashedPassword, newPassword: "New-Password" }),
    });

    assertEquals(response.status, 204);
  }
});

Deno.test("PUT /ext/v1/self/password should return user-unauthorized if the user is a guest", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self/password", {
    method: "PUT",
    headers: headers(uuid(), "guest"),
    body: JSON.stringify({ oldPassword: "Password", newPassword: "New-Password" }),
  });
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(body.kind, "user-unauthorized");
});

Deno.test("PUT /ext/v1/self/password should return schema-mismatch if the body is invalid", async () => {
  for (const reqBody of [{ oldPassword: "Password" }, { newPassword: "Password" }, { test: "invalid" }]) {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request("/ext/v1/self/password", {
      method: "PUT",
      headers: headers(accountMock.id, "passenger"),
      body: JSON.stringify(reqBody),
    });
    const body = await response.json();

    assertEquals(response.status, 422);
    assertEquals(body.kind, "schema-mismatch");
  }
});

Deno.test("PUT /ext/v1/self/password should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self/password", {
    method: "PUT",
    headers: headers(uuid(), "passenger"),
    body: JSON.stringify({ oldPassword: "Password", newPassword: "New-Password" }),
  });
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});

Deno.test("PUT /ext/v1/self/password should return invalid-account-data if the old password is incorrect", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request("/ext/v1/self/password", {
    method: "PUT",
    headers: headers(accountMock.id, "passenger"),
    body: JSON.stringify({ oldPassword: "Incorrect-Password", newPassword: "New-Password" }),
  });
  const body = await response.json();

  assertEquals(response.status, 400);
  assertEquals(body.kind, "invalid-account-data");
});

Deno.test("PUT /ext/v1/self/password should return invalid-account-data if the new password is the same as the old password", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request("/ext/v1/self/password", {
    method: "PUT",
    headers: headers(accountMock.id, "passenger"),
    body: JSON.stringify({ oldPassword: accountMock.hashedPassword, newPassword: accountMock.hashedPassword }),
  });
  const body = await response.json();

  assertEquals(response.status, 400);
  assertEquals(body.kind, "invalid-account-data");
});
