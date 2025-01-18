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

const correctBody = {
  email: accountMock.email,
  password: "Password",
};

Deno.test("POST /ext/v1/login should return tokens in the happy path", async () => {
  const { accountRepo, api } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request("/ext/v1/login", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify(correctBody),
  });
  const body = await response.json();

  assertEquals(response.status, 200);
  assert("accessToken" in body);
  assert("refreshToken" in body);
  assertEquals(body.tokenType, "Bearer");
  assertEquals(body.expiresIn, EXPIRES_IN_S_ACCESS);
});

Deno.test("POST /ext/v1/login should return schema-mismatch if the body is invalid", async () => {
  for (const reqBody of [{}, { email: accountMock.email }, { password: "Password" }]) {
    const { api } = await setupTest();

    const response = await api.request("/ext/v1/login", {
      method: "POST",
      headers: correctHeaders,
      body: JSON.stringify(reqBody),
    });
    const body = await response.json();

    assertEquals(response.status, 422);
    assertEquals(body.kind, "schema-mismatch");
  }
});

Deno.test("POST /ext/v1/login should return schema-mismatch if body has wrong content-type", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/login", {
    method: "POST",
    headers: { ...correctHeaders, "content-type": "text/plain" },
    body: JSON.stringify(correctBody),
  });
  const body = await response.json();

  assertEquals(response.status, 422);
  assertEquals(body.kind, "schema-mismatch");
});

Deno.test("POST /ext/v1/login should return invalid-credentials if the email is invalid", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/login", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify(correctBody),
  });
  const body = await response.json();

  assertEquals(response.status, 403);
  assertEquals(body.kind, "invalid-credentials");
});

Deno.test("POST /ext/v1/login should return invalid-credentials if the password is invalid", async () => {
  const { accountRepo, api } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request("/ext/v1/login", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify({ ...correctBody, password: "Invalid-Password" }),
  });
  const body = await response.json();

  assertEquals(response.status, 403);
  assertEquals(body.kind, "invalid-credentials");
});
