import { uuid } from "@jobberknoll/core/shared";
import { assert } from "@std/assert";
import { omit } from "@std/collections";
import { extHeadersSchema } from "./openapi.ts";

const validExtHeaders = {
  "jp-user-id": uuid(),
  "jp-user-role": "guest",
  "jp-request-id": uuid(),
  "user-agent": "Phoenix/1.0",
};

Deno.test("extHeadersSchema should accept valid headers", () => {
  const result = extHeadersSchema("guest").safeParse(validExtHeaders);

  assert(result.success);
});

Deno.test("extHeadersSchema should accept missing optional headers", () => {
  const result = extHeadersSchema("guest").safeParse(omit(validExtHeaders, ["jp-request-id", "user-agent"]));

  assert(result.success);
});

Deno.test("extHeadersSchema should reject missing required headers", () => {
  const result = extHeadersSchema("guest").safeParse({});

  assert(!result.success);
});

Deno.test("extHeadersSchema should reject numerical IDs", () => {
  const result = extHeadersSchema("guest").safeParse({
    ...validExtHeaders,
    "jp-user-id": "123",
    "jp-request-id": "456",
  });

  assert(!result.success);
});

Deno.test("extHeadersSchema should reject invalid roles", () => {
  for (const role of [undefined, "", "invalid", "something"]) {
    const result = extHeadersSchema("guest").safeParse({ ...validExtHeaders, "jp-user-role": role });

    assert(!result.success);
  }
});
