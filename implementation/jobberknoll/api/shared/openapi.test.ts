import { z } from "@hono/zod-openapi";
import { uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals } from "@std/assert";
import { errorDto, IdParamSchema, jsonReq, jsonRes, RequestIdSchema, UserAgentSchema, UuidSchema } from "./openapi.ts";

const TestSchema = z.literal("test");
const TestDto = errorDto("TestDto", 400, "test", "A test DTO.");

Deno.test("jsonReq should return a request object which is required by default", () => {
  const description = "A test schema.";

  const result = jsonReq(TestSchema, description);

  assertEquals(result, {
    content: { "application/json": { schema: TestSchema } },
    description,
    required: true,
  });
});

Deno.test("jsonReq should return a request object which is not required when specified", () => {
  const description = "A test schema.";

  const result = jsonReq(TestSchema, description, false);

  assertEquals(result, {
    content: { "application/json": { schema: TestSchema } },
    description,
    required: false,
  });
});

Deno.test("jsonRes should return a response object", () => {
  const description = "A test schema.";

  const result = jsonRes(TestSchema, description);

  assertEquals(result, {
    content: { "application/json": { schema: TestSchema } },
    description,
  });
});

Deno.test("errorDto should accept correct errors", () => {
  const testError = {
    code: 400,
    kind: "test",
    messageEn: "Test error message.",
  };

  const result = TestDto.safeParse(testError);

  assert(result.success);
});

Deno.test("errorDto should reject mismatched codes and kinds", () => {
  for (
    const [code, kind] of [
      [401, "test"],
      [400, "wrong"],
      [402, "wrong"],
    ]
  ) {
    const testError = { code, kind, messageEn: "Message." };

    const result = TestDto.safeParse(testError);

    assert(!result.success);
  }
});

Deno.test("UuidSchema should accept correct IDs", () => {
  const id = uuid();

  const result = UuidSchema.safeParse(id);

  assert(result.success);
});

Deno.test("UuidSchema should reject numerical IDs", () => {
  const id = "123";

  const result = UuidSchema.safeParse(id);

  assert(!result.success);
});

Deno.test("UuidSchema should reject IDs with wrong version", () => {
  const id = "1be75dc9-ac00-45f8-b015-b64d007abf84";

  const result = UuidSchema.safeParse(id);

  assert(!result.success);
});

Deno.test("RequestIdSchema should accept correct IDs", () => {
  const id = uuid();

  const result = RequestIdSchema.safeParse(id);

  assert(result.success);
});

Deno.test("RequestIdSchema should accept missing IDs", () => {
  const result = RequestIdSchema.safeParse(undefined);

  assert(result.success);
});

Deno.test("RequestIdSchema should reject numerical IDs", () => {
  const id = "123";

  const result = RequestIdSchema.safeParse(id);

  assert(!result.success);
});

Deno.test("UserAgentSchema should accept any string", () => {
  const result = UserAgentSchema.safeParse("Phoenix/1.0.0");

  assert(result.success);
});

Deno.test("UserAgentSchema should accept missing values", () => {
  const result = UserAgentSchema.safeParse(undefined);

  assert(result.success);
});

Deno.test("IdParamSchema should accept correct IDs", () => {
  const id = uuid();

  const result = IdParamSchema.safeParse({ id });

  assert(result.success);
});

Deno.test("IdParamSchema should reject numerical IDs", () => {
  const id = "123";

  const result = IdParamSchema.safeParse({ id });

  assert(!result.success);
});
