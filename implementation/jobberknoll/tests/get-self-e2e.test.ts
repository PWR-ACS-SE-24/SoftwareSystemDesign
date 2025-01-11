import { newCtx, UserRole } from "@jobberknoll/app";
import { accountMock, NIL_UUID, UUID, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals, assertObjectMatch } from "@std/assert";
import { setupTest } from "../setup.ts";

function headers(userId: UUID, role: UserRole) {
  return {
    "jp-user-id": userId,
    "jp-user-role": role,
    "jp-request-id": uuid(),
    "user-agent": "Phoenix/1.0.0",
  };
}

Deno.test("GET /ext/v1/self should return the account in the happy path", async () => {
  for (const role of ["admin", "driver", "inspector", "passenger"] as const) {
    const { api, accountRepo } = await setupTest();
    await accountRepo.createAccount(newCtx(), accountMock);

    const response = await api.request("/ext/v1/self", { headers: headers(accountMock.id, role) });
    const body = await response.json();

    assertEquals(response.status, 200);
    assertObjectMatch(accountMock, body);
    assert(!("hashedPassword" in body));
    assert(!("lastModified" in body));
  }
});

Deno.test("GET /ext/v1/self should return user-unauthorized if the user is a guest", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self", {
    headers: headers(NIL_UUID, "guest"),
  });
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(body.kind, "user-unauthorized");
});

Deno.test("GET /ext/v1/self should return schema-mismatch if the user id or role is invalid", async () => {
  for (
    const [userId, role] of [
      ["123", "admin"],
      [uuid(), "invalid"],
      [undefined, undefined],
      [undefined, "driver"],
      [uuid(), undefined],
    ] as const
  ) {
    const { api } = await setupTest();

    const response = await api.request("/ext/v1/self", {
      headers: headers(userId as UUID, role as UserRole), // SAFETY: we purposefully pass invalid values
    });
    const body = await response.json();

    assertEquals(response.status, 422);
    assertEquals(body.kind, "schema-mismatch");
  }
});

Deno.test("GET /ext/v1/self should return account-not-found if the account does not exist", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/self", { headers: headers(uuid(), "inspector") });
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.kind, "account-not-found");
});
