import { assert, assertNotEquals } from "@std/assert";
import { hashPassword, isPasswordHashed, verifyPassword } from "./passwords.ts";

// NOTE: these tests act as regression tests in case the underlying implementation changes, they should not check implementation details (e.g. the usage of Argon2id)

Deno.test("hashPassword should transform the password", async () => {
  const userPassword = "Password";
  const phcHash = await hashPassword(userPassword);

  assertNotEquals(userPassword, phcHash);
});

Deno.test("hashPassword should return a string of constant length regardless of password length", async () => {
  const hashes = [
    await hashPassword(""),
    await hashPassword("test"),
    await hashPassword("this is a longer password"),
    await hashPassword("this is a very long password that is longer than the previous one"),
  ];

  const hashLength = hashes[0].length;
  assert(hashes.every((hash) => hash.length === hashLength));
});

Deno.test("hashPassword should return different hashes for different passwords", async () => {
  const phcHash1 = await hashPassword("Password1");
  const phcHash2 = await hashPassword("Password2");

  assertNotEquals(phcHash1, phcHash2);
});

Deno.test("hashPassword should return different hashes for the same password (because of salt)", async () => {
  const userPassword = "Password";
  const phcHash1 = await hashPassword(userPassword);
  const phcHash2 = await hashPassword(userPassword);

  assertNotEquals(phcHash1, phcHash2);
});

Deno.test("hashPassword should return a PHC string format hash", async () => {
  const phcHash = await hashPassword("Password");

  assert(isPasswordHashed(phcHash));
});

Deno.test("hashPassword should be verifiable through verifyPassword", async () => {
  const userPassword = "Password";
  const phcHash = await hashPassword(userPassword);

  assert(await verifyPassword(userPassword, phcHash));
});

Deno.test("verifyPassword should return false for a different password", async () => {
  const userPassword = "Password";
  const phcHash = await hashPassword(userPassword);

  assert(!await verifyPassword("DifferentPassword", phcHash));
});
