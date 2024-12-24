import { accountMock, isErr, ok, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals } from "@std/assert";
import { MemoryAccountRepo } from "./memory-account-repo.ts";

Deno.test("getAccountById should return an account if it exists", async () => {
  const accountRepo = new MemoryAccountRepo([accountMock]);

  const result = await accountRepo.getAccountById(accountMock.id);

  assertEquals(result, ok(accountMock));
});

Deno.test(
  "getAccountById should return account-not-found if the account does not exist",
  async () => {
    const id = uuid();
    const accountRepo = new MemoryAccountRepo();

    const result = await accountRepo.getAccountById(id);

    assert(isErr(result));
  },
);

Deno.test("getAccountById should return account-not-found if the account is inactive", async () => {
  const inactiveAccount = { ...accountMock, isActive: false };
  const accountRepo = new MemoryAccountRepo([inactiveAccount]);

  const result = await accountRepo.getAccountById(inactiveAccount.id);

  assert(isErr(result));
});
