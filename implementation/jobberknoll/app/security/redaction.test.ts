import { assert, assertEquals } from "@std/assert";
import { redactSensitiveKeysDeep, redactText } from "./redaction.ts";

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

Deno.test("redactSensitiveKeysDeep should redact keys from the top level", async () => {
  const object = {
    databaseUrl: "SECRET_DATABASE_URL",
    fullName: "John Doe",
    email: "john.doe@example.com",
    password: 123456,
    hashedPassword: "$2a$12$9ANxmspzFpoEN.4hCKnuue.obvvT1s3GRIO.rz04ZJlfsLVMvID/K",
    phoneNumber: "123456789",
  };

  const data = JSON.stringify(await redactSensitiveKeysDeep(object));

  for (const value of Object.values(object)) {
    assert(!data.includes(JSON.stringify(value)));
  }
});

Deno.test("redactSensitiveKeysDeep should retain non-sensitive keys", async () => {
  const object = {
    key: 123,
    something: "else",
    nested: {
      key: 456,
      another: "thing",
    },
  };

  const data = JSON.stringify(await redactSensitiveKeysDeep(object));

  for (const value of Object.values(object)) {
    assert(data.includes(JSON.stringify(value)));
  }
});

Deno.test("redactSensitiveKeysDeep should redact keys from nested objects", async () => {
  const object = {
    nested: {
      databaseUrl: "SECRET",
    },
    deeply: {
      nested: {
        fullName: "SECRET",
      },
    },
  };

  const data = JSON.stringify(await redactSensitiveKeysDeep(object));

  assert(!data.includes("SECRET"));
});
