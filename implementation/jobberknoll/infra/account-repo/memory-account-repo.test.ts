import { accountMock, isErr, ok, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals } from "@std/assert";
import { newCtx } from "../../app/shared/ctx.ts";
import { TestLogger } from "../logger/mod.ts";
import { MemoryAccountRepo } from "./memory-account-repo.ts";

Deno.test("getAccountById should return an account if it exists", async () => {
  const accountRepo = new MemoryAccountRepo(new TestLogger());
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await accountRepo.getAccountById(newCtx(), accountMock.id);

  assertEquals(result, ok(accountMock));
});

Deno.test("getAccountById should return account-not-found if the account does not exist", async () => {
  const id = uuid();
  const accountRepo = new MemoryAccountRepo(new TestLogger());

  const result = await accountRepo.getAccountById(newCtx(), id);

  assert(isErr(result));
});

// TODO: Implement missing tests
