import { accountMock, isErr, isOk } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert } from "@std/assert";
import { newCtx } from "~/shared/mod.ts";
import { DeleteAccountUseCase } from "./delete-account-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const deleteAccount = new DeleteAccountUseCase(logger, accountRepo);
  return { logger, accountRepo, deleteAccount };
}

Deno.test("DeleteAccountUseCase should return an ok result if the account existed", async () => {
  const { accountRepo, deleteAccount } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await deleteAccount.invoke(newCtx(), { accountId: accountMock.id });

  assert(isOk(result));
});

Deno.test("DeleteAccountUseCase should delete the account from the repository if it existed", async () => {
  const { accountRepo, deleteAccount } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await deleteAccount.invoke(newCtx(), { accountId: accountMock.id });
  const found = await accountRepo.getAccountById(newCtx(), accountMock.id);

  assert(isErr(found));
});

Deno.test("DeleteAccountUseCase should audit the deletion if the account existed", async () => {
  const { logger, accountRepo, deleteAccount } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await deleteAccount.invoke(newCtx(), { accountId: accountMock.id });

  assert(logger.matches("audit log - AccountDeleted"));
});

Deno.test("DeleteAccountUseCase should return account-not-found if the account did not exist", async () => {
  const { deleteAccount } = setup();

  const result = await deleteAccount.invoke(newCtx(), { accountId: accountMock.id });

  assert(isErr(result));
});

Deno.test("DeleteAccountUseCase should not audit the deletion if the account did not exist", async () => {
  const { logger, deleteAccount } = setup();

  await deleteAccount.invoke(newCtx(), { accountId: accountMock.id });

  assert(!logger.matches("audit log - AccountDeleted"));
});
