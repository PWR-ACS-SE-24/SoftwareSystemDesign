import { newCtx } from "@jobberknoll/app";
import { accountMock, isSome, NIL_UUID, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals, assertObjectMatch } from "@std/assert";
import { setupTest } from "../setup.ts";

const correctHeaders = {
  "content-type": "application/json",
  "jp-user-id": NIL_UUID,
  "jp-user-role": "guest",
  "jp-request-id": uuid(),
  "user-agent": "Phoenix/1.0.0",
};

const correctBody = {
  fullName: "John Smith",
  email: "john.smith@example.com",
  password: "password",
  phoneNumber: null,
};

Deno.test("POST /ext/v1/register should create an account in the happy path", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/register", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify(correctBody),
  });
  const body = await response.json();

  assertEquals(response.status, 201);
  assert(isSome(uuid(body.id)));
  assertEquals(body.type, "passenger");
  assertEquals(body.fullName, "John Smith");
  assertEquals(body.email, "john.smith@example.com");
  assert(!("hashedPassword" in body));
  assert(!("lastModified" in body));
});

Deno.test("POST /ext/v1/register should return schema-mismatch if the body is invalid", async () => {
  for (const reqBody of [{}, { fullName: "" }, { email: "john.smith" }, { password: "pass" }]) {
    const { api } = await setupTest();

    const response = await api.request("/ext/v1/register", {
      method: "POST",
      headers: correctHeaders,
      body: JSON.stringify(reqBody),
    });
    const body = await response.json();

    assertEquals(response.status, 422);
    assertEquals(body.kind, "schema-mismatch");
  }
});

Deno.test("POST /ext/v1/register should return schema-mismatch if body has wrong content-type", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/register", {
    method: "POST",
    headers: { ...correctHeaders, "content-type": "text/plain" },
    body: JSON.stringify(correctBody),
  });
  const body = await response.json();

  assertEquals(response.status, 422);
  assertEquals(body.kind, "schema-mismatch");
});

Deno.test("POST /ext/v1/register should return invalid-account-data if the email is already taken", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), accountMock);

  const response = await api.request("/ext/v1/register", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify({ ...correctBody, email: accountMock.email }),
  });
  const body = await response.json();

  assertEquals(response.status, 400);
  assertEquals(body.kind, "invalid-account-data");
});

Deno.test("POST /ext/v1/register should create an account fetchable from GET /ext/v1/self", async () => {
  const { api } = await setupTest();

  const registerResponse = await api.request("/ext/v1/register", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify(correctBody),
  });
  const registerBody = await registerResponse.json();
  assertEquals(registerResponse.status, 201);

  const getResponse = await api.request("/ext/v1/self", {
    headers: { ...correctHeaders, "jp-user-id": registerBody.id, "jp-user-role": "passenger" },
  });
  const getBody = await getResponse.json();

  assertEquals(getResponse.status, 200);
  assertObjectMatch(getBody, registerBody);
});
