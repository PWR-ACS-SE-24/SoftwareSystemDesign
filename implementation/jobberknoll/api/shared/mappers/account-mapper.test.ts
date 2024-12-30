import { accountMock } from "@jobberknoll/core/shared";
import { assert, assertEquals } from "@std/assert";
import { mapAccountToDto } from "~/shared/mappers/mod.ts";

Deno.test("mapAccountToDto should correctly transfer properties", () => {
  const result = mapAccountToDto(accountMock);

  assertEquals(result.id, accountMock.id);
  assertEquals(result.type, accountMock.type);
  assertEquals(result.fullName, accountMock.fullName);
  assertEquals(result.email, accountMock.email);
});

Deno.test("mapAccountToDto should not leak private fields", () => {
  const result = mapAccountToDto(accountMock);

  assert(!("hashedPassword" in result));
  assert(!("lastModified" in result));
});

Deno.test("mapAccountToDto omit phoneNumber for non-passenger types", () => {
  for (const type of ["admin", "driver", "inspector"] as const) {
    const result = mapAccountToDto({ ...accountMock, type });

    assert(!("phoneNumber" in result));
  }
});

Deno.test("mapAccountToDto should return null for null passenger phoneNumbers", () => {
  const result = mapAccountToDto({
    ...accountMock,
    type: "passenger",
    phoneNumber: null,
  });

  assertEquals(result.phoneNumber, null);
});

Deno.test("mapAccountToDto should return phoneNumber for non-null passenger phoneNumbers", () => {
  const result = mapAccountToDto({
    ...accountMock,
    type: "passenger",
    phoneNumber: "123-456-7890",
  });

  assertEquals(result.phoneNumber, "123-456-7890");
});
