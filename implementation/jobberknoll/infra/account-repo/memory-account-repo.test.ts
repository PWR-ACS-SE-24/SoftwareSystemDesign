import type { Account } from "@jobberknoll/core/domain";
import { isErr, ok, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals } from "@std/assert";
import { MemoryAccountRepo } from "./memory-account-repo.ts";

Deno.test("getAccountById should return an account if it exists", async () => {
  const account = {
    id: uuid(),
    type: "passenger",
    fullName: "John Smith",
    email: "john.smith@example.com",
    hashedPassword:
      "$2a$12$9rnvHqxGPHRiMtBZlKwKluiQ.qDY3BkmAFN3prpZdkuRhtE9Zx0gy",
    isActive: true,
    lastModified: 1734977958974,
  } satisfies Account;
  const accountRepo = new MemoryAccountRepo({ [account.id]: account });

  const result = await accountRepo.getAccountById(account.id);

  assertEquals(result, ok(account));
});

Deno.test("getAccountById should return an error if the account does not exist", async () => {
  const id = uuid();
  const accountRepo = new MemoryAccountRepo();

  const result = await accountRepo.getAccountById(id);

  assert(isErr(result));
});
