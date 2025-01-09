import { newCtx } from "@jobberknoll/app";
import { accountMock, isErr, isNone, ok, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals, assertRejects } from "@std/assert";
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

  assert(!isNone(option));
});
