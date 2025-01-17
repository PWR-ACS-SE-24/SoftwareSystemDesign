import { EXPIRES_IN_S_ACCESS, newCtx } from "@jobberknoll/app";
import { accountMock, NIL_UUID, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals } from "@std/assert";
import { setupTest } from "../setup.ts";

const correctHeaders = {
  "content-type": "application/json",
  "jp-user-id": NIL_UUID,
  "jp-user-role": "guest",
  "jp-request-id": uuid(),
  "user-agent": "Phoenix/1.0.0",
};

Deno.test("POST /ext/v1/refresh should return tokens in the happy path", async () => {
  const { accountRepo, api } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const loginResponse = await api.request("/ext/v1/login", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify({
      email: accountMock.email,
      password: "Password",
    }),
  });
  const loginBody = await loginResponse.json();

  const refreshResponse = await api.request("/ext/v1/refresh", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify({ refreshToken: loginBody.refreshToken }),
  });
  const refreshBody = await refreshResponse.json();

  assertEquals(refreshResponse.status, 200);
  assert("accessToken" in refreshBody);
  assert("refreshToken" in refreshBody);
  assertEquals(refreshBody.tokenType, "Bearer");
  assertEquals(refreshBody.expiresIn, EXPIRES_IN_S_ACCESS);
});

Deno.test("POST /ext/v1/refresh should return schema-mismatch if the body is invalid", async () => {
  for (const reqBody of [{}, { accessToken: "123" }, { refreshToken: "123" }]) {
    const { api } = await setupTest();

    const response = await api.request("/ext/v1/refresh", {
      method: "POST",
      headers: correctHeaders,
      body: JSON.stringify(reqBody),
    });
    const body = await response.json();

    assertEquals(response.status, 422);
    assertEquals(body.kind, "schema-mismatch");
  }
});
