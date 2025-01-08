import { z } from "@hono/zod-openapi";
import { uuid } from "@jobberknoll/core/shared";
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

Deno.test("errorDto should accept correct errors", () => {
  const TestDto = errorDto("TestDto", 400, "test", "A test DTO.");
  const testError = {
    code: 400,
    kind: "test",
    messageEn: "Test error message.",
  };

  const result = TestDto.safeParse(testError);

  assert(result.success);
});

Deno.test("errorDto should reject mismatched codes and kinds", () => {
  const TestDto = errorDto("TestDto", 400, "test", "A test DTO.");

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

// TODO: Implement missing tests
