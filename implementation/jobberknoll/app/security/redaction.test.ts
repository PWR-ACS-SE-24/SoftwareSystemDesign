import { assert, assertEquals } from "@std/assert";
import { redactText } from "./redaction.ts";

Deno.test("redactText should redact the contents", async () => {
  for (const input of ["abcd", "test", "hello world"]) {
    const actual = await redactText(input);

    assert(!actual.includes(input));
    assert(!input.includes(actual));
    assert(actual.includes("REDACTED"));
    assert(actual.startsWith("["));
    assert(actual.endsWith("]"));
  }
});

Deno.test("redactText should redact empty strings", async () => {
  const actual = await redactText("");

  assert(actual.includes("REDACTED"));
});

Deno.test("redactText should produce the same output for the same input", async () => {
  const input = "test";
  const actual1 = await redactText(input);
  const actual2 = await redactText(input);

  assertEquals(actual1, actual2);
});
