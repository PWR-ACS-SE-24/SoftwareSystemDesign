import type { Account } from "@jobberknoll/core/domain";
import { isErr, ok } from "@jobberknoll/core/shared";
import { assertEquals } from "@std/assert";
import { MemoryAccountRepo } from "./memory-account-repo.ts";

Deno.test("getAccountById should return an account if it exists", async () => {
  const account = {
    id: "0193f4bc-2657-7dcd-895a-c21c45e5b334",
    tag: "passenger",
    fullName: "Jan Kowalski",
    email: "jan.kowalski@example.com",
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
  const id = "0193f4bc-2657-7dcd-895a-c21c45e5b334";
  const accountRepo = new MemoryAccountRepo();

  const result = await accountRepo.getAccountById(id);

  assertEquals(isErr(result), true);
});
