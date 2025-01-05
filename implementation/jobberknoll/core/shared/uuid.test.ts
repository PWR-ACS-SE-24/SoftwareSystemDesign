import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { isNone, isSome } from "./option.ts";
import { NIL_UUID, uuid } from "./uuid.ts";

const fuzz = (test: () => void) => {
  for (let i = 0; i < 100; i++) {
    test();
  }
};

Deno.test("uuid should generate a string with the correct length", () => {
  fuzz(() => {
    const id = uuid();

    assertEquals(id.length, 36);
  });
});

Deno.test("uuid should generate unique strings", () => {
  fuzz(() => {
    const id1 = uuid();
    const id2 = uuid();

    assertNotEquals(id1, id2);
  });
});

Deno.test("uuid should accept its own output", () => {
  fuzz(() => {
    const id = uuid();

    const option = uuid(id as string);

    assert(isSome(option));
  });
});

Deno.test("uuid should accept valid input", () => {
  const option = uuid("0193f590-e4c4-774d-9d92-8bac692af898");

  assert(isSome(option));
});

Deno.test("uuid should accept nil UUID", () => {
  const option = uuid(NIL_UUID);

  assert(isSome(option));
});

Deno.test("uuid should reject invalid input", () => {
  const option = uuid("invalid");

  assert(isNone(option));
});

Deno.test("uuid should reject other versions of UUID", () => {
  const option = uuid("473c0b09-7209-48a2-abc7-7d0be3c61248");

  assert(isNone(option));
});
