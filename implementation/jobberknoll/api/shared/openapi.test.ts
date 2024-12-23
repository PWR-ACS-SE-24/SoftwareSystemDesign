import { z } from "@hono/zod-openapi";
import { assertEquals } from "@std/assert";
import { jsonRes } from "./openapi.ts";

Deno.test("jsonRes should return a response object", () => {
  const TestSchema = z.literal("test");
  const description = "A test schema.";

  const result = jsonRes(TestSchema, description);

  assertEquals(result, {
    content: { "application/json": { schema: TestSchema } },
    description,
  });
});
