import { newCtx } from "@jobberknoll/app";
import { accountMock, isSome, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals, assertObjectMatch } from "@std/assert";
import { setupTest } from "../setup.ts";

const correctHeaders = {
  "content-type": "application/json",
  "jp-user-id": uuid(),
  "jp-user-role": "admin",
  "jp-request-id": uuid(),
  "user-agent": "Phoenix/1.0.0",
};

const correctBody = {
  type: "driver",
  fullName: "John Smith",
  email: "john.smith@example.com",
  password: "password",
};

Deno.test("POST /ext/v1/accounts should create an account if data is valid", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/accounts", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify(correctBody),
  });
  const body = await response.json();

  assertEquals(response.status, 201);
  assert(isSome(uuid(body.id)));
  assertEquals(body.type, "driver");
  assertEquals(body.fullName, "John Smith");
  assertEquals(body.email, "john.smith@example.com");
  assert(!("hashedPassword" in body));
  assert(!("lastModified" in body));
});

Deno.test("POST /ext/v1/accounts should return user-unauthorized if user is not an admin", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/accounts", {
    method: "POST",
    headers: { ...correctHeaders, "jp-user-role": "passenger" },
    body: JSON.stringify(correctBody),
  });
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(body.kind, "user-unauthorized");
});

for (
  const [field, value] of [
    ["type", "passenger"],
    ["fullName", ""],
    ["email", "john.smith"],
    ["password", "pass"],
  ]
) {
  Deno.test(`POST /ext/v1/accounts should return schema-mismatch if ${field} is invalid`, async () => {
    const { api } = await setupTest();

    const response = await api.request("/ext/v1/accounts", {
      method: "POST",
      headers: correctHeaders,
      body: JSON.stringify({ ...correctBody, [field]: value }),
    });
    const body = await response.json();

    assertEquals(response.status, 422);
    assertEquals(body.kind, "schema-mismatch");
  });
}

Deno.test("POST /ext/v1/accounts should return schema-mismatch if body has wrong content-type", async () => {
  const { api } = await setupTest();

  const response = await api.request("/ext/v1/accounts", {
    method: "POST",
    headers: { ...correctHeaders, "content-type": "text/plain" },
    body: JSON.stringify(correctBody),
  });
  const body = await response.json();

  assertEquals(response.status, 422);
  assertEquals(body.kind, "schema-mismatch");
});

Deno.test("POST /ext/v1/accounts should return invalid-account-data if the email is already taken", async () => {
  const { api, accountRepo } = await setupTest();
  await accountRepo.createAccount(newCtx(), { ...accountMock, email: "taken-email@example.com" });

  const response = await api.request("/ext/v1/accounts", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify({ ...correctBody, email: "taken-email@example.com" }),
  });
  const body = await response.json();

  assertEquals(response.status, 400);
  assertEquals(body.kind, "invalid-account-data");
});

Deno.test("POST /ext/v1/accounts should create an account fetchable from GET /ext/v1/accounts/{id}", async () => {
  const { api } = await setupTest();

  const createResponse = await api.request("/ext/v1/accounts", {
    method: "POST",
    headers: correctHeaders,
    body: JSON.stringify(correctBody),
  });
  const createBody = await createResponse.json();

  assertEquals(createResponse.status, 201);

  const getResponse = await api.request(`/ext/v1/accounts/${createBody.id}`, { headers: correctHeaders });
  const getBody = await getResponse.json();

  assertEquals(getResponse.status, 200);
  assertObjectMatch(getBody, createBody);
});
