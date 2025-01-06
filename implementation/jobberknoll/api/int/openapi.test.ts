import { uuid } from "@jobberknoll/core/shared";
import { assert } from "@std/assert";
import { IntHeadersSchema } from "./openapi.ts";

const validIntHeaders = {
  "jp-request-id": uuid(),
  "user-agent": "Phoenix/1.0",
};

Deno.test("IntHeadersSchema should accept valid headers", () => {
  const result = IntHeadersSchema.safeParse(validIntHeaders);

  assert(result.success);
});

Deno.test("IntHeadersSchema should accept missing optional headers", () => {
  const result = IntHeadersSchema.safeParse({});

  assert(result.success);
});

Deno.test("IntHeadersSchema should accept unnecessary headers", () => {
  const result = IntHeadersSchema.safeParse({ ...validIntHeaders, "jp-user-id": uuid(), "jp-user-role": "admin" });

  assert(result.success);
});

Deno.test("IntHeadersSchema should reject numerical IDs", () => {
  const result = IntHeadersSchema.safeParse({
    ...validIntHeaders,
    "jp-request-id": "456",
  });

  assert(!result.success);
});
