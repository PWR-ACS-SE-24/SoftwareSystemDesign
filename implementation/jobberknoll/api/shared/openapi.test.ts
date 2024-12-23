import { z } from "@hono/zod-openapi";
import { assert, assertEquals } from "@std/assert";
import { errorDto, IdParamSchema, jsonRes } from "./openapi.ts";

Deno.test("jsonRes should return a response object", () => {
  const TestSchema = z.literal("test");
  const description = "A test schema.";

  const result = jsonRes(TestSchema, description);

  assertEquals(result, {
    content: { "application/json": { schema: TestSchema } },
    description,
  });
});

Deno.test("errorDto should validate correct errors", () => {
  const TestDto = errorDto("TestDto", 400, "test", "A test DTO.");
  const testError = {
    code: 400,
    kind: "test",
    messageEn: "Test error message.",
  };

  const result = TestDto.safeParse(testError);

  assert(result.success);
});

Deno.test("errorDto should reject mismatched codes", () => {
  const TestDto = errorDto("TestDto", 400, "test", "A test DTO.");
  const testError = {
    code: 401,
    kind: "test",
    messageEn: "Test error message.",
  };

  const result = TestDto.safeParse(testError);

  assert(!result.success);
});

Deno.test("errorDto should reject mismatched kinds", () => {
  const TestDto = errorDto("TestDto", 400, "test", "A test DTO.");
  const testError = {
    code: 400,
    kind: "test2",
    messageEn: "Test error message.",
  };

  const result = TestDto.safeParse(testError);

  assert(!result.success);
});

Deno.test("IdParamSchema should validate correct IDs", () => {
  const id = "0193f56a-fdc6-7ac4-b6b5-76402783f36b";

  const result = IdParamSchema.safeParse({ id });

  assert(result.success);
});

Deno.test("IdParamSchema should reject numerical IDs", () => {
  const id = "123";

  const result = IdParamSchema.safeParse({ id });

  assert(!result.success);
});
