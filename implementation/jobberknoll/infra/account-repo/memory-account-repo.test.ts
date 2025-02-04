import { newCtx } from "@jobberknoll/app";
import { accountMock, isErr, isNone, isSome, ok, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals, assertObjectMatch, assertRejects } from "@std/assert";
import { TestLogger } from "../logger/mod.ts";
import { MemoryAccountRepo } from "./memory-account-repo.ts";

Deno.test("createAccount should add an account to the repo", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());

  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await accountRepo.getAccountById(newCtx(), accountMock.id);
  assertEquals(result, ok(accountMock));
});

Deno.test("createAccount should reject on duplicate IDs", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), { ...accountMock, email: "another@example.com" });

  assertRejects(() => accountRepo.createAccount(newCtx(), accountMock));
});

Deno.test("createAccount should reject on duplicate emails", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), { ...accountMock, id: uuid() });

  assertRejects(() => accountRepo.createAccount(newCtx(), accountMock));
});

Deno.test("isEmailTaken should return true if the email is taken", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), accountMock);

  const isTaken = await accountRepo.isEmailTaken(newCtx(), accountMock.email);

  assert(isTaken);
});

Deno.test("isEmailTaken should return false if the email is not taken", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());

  const isTaken = await accountRepo.isEmailTaken(newCtx(), accountMock.email);

  assert(!isTaken);
});

Deno.test("getAccountById should return an account if it exists", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await accountRepo.getAccountById(newCtx(), accountMock.id);

  assertEquals(result, ok(accountMock));
});

Deno.test("getAccountById should return account-not-found if the account does not exist", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());

  const result = await accountRepo.getAccountById(newCtx(), uuid());

  assert(isErr(result));
  assertEquals(result.value.kind, "account-not-found");
});

Deno.test("getAccountByEmail should return an account if it exists", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await accountRepo.getAccountByEmail(newCtx(), accountMock.email);

  assertEquals(result, ok(accountMock));
});

Deno.test("getAccountByEmail should return invalid-account-data if the account does not exist", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());

  const result = await accountRepo.getAccountByEmail(newCtx(), accountMock.email);

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-account-data");
});

Deno.test("editAccount should update the account in the repo if it exists", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), accountMock);

  await accountRepo.editAccount(newCtx(), {
    ...accountMock,
    fullName: "New Name",
    lastModified: Math.floor(Date.now() / 1000),
  });

  const result = await accountRepo.getAccountById(newCtx(), accountMock.id);
  assertObjectMatch(result.value, { fullName: "New Name" });
});

Deno.test("editAccount should not throw if the account does not exist", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());

  await accountRepo.editAccount(newCtx(), accountMock);
});

Deno.test("deleteAccount should return none option if the account exists", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), accountMock);

  const option = await accountRepo.deleteAccount(newCtx(), accountMock.id);

  assert(isNone(option));
});

Deno.test("deleteAccount should remove the account from the repo if it exists", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), accountMock);

  await accountRepo.deleteAccount(newCtx(), accountMock.id);

  const result = await accountRepo.getAccountById(newCtx(), accountMock.id);
  assert(isErr(result));
});

Deno.test("deleteAccount should return some account-not-found if the account does not exist", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());

  const option = await accountRepo.deleteAccount(newCtx(), uuid());

  assert(isSome(option));
  assertEquals(option.value.kind, "account-not-found");
});

for (const [status, isHealthy] of [["UP", true], ["DOWN", false]] as const) {
  Deno.test(`health should return ${status} if the repo is healthy=${isHealthy}`, async () => {
    const accountRepo = new MemoryAccountRepo(new TestLogger());
    accountRepo.isHealthy = isHealthy;

    const health = await accountRepo.health();

    assertObjectMatch(health, { status });
  });
}

Deno.test("all methods should fail if the repo is unhealthy", () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  accountRepo.isHealthy = false;

  assertRejects(() => accountRepo.createAccount(newCtx(), accountMock));
  assertRejects(() => accountRepo.isEmailTaken(newCtx(), accountMock.email));
  assertRejects(() => accountRepo.getAccountById(newCtx(), accountMock.id));
  assertRejects(() => accountRepo.editAccount(newCtx(), accountMock));
  assertRejects(() => accountRepo.deleteAccount(newCtx(), accountMock.id));
});
