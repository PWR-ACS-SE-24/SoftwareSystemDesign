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

// TODO: Test phoneNumber mapping
