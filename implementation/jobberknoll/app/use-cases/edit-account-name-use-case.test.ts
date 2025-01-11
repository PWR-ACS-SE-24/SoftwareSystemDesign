import { accountMock, isErr, isOk } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { newCtx } from "~/shared/mod.ts";
import { GetAccountByIdUseCase } from "~/use-cases/mod.ts";
import { EditAccountNameUseCase } from "./edit-account-name-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const getAccountById = new GetAccountByIdUseCase(logger, accountRepo);
  const editAccountName = new EditAccountNameUseCase(logger, accountRepo, getAccountById);
  return { logger, accountRepo, editAccountName };
}

Deno.test("EditAccountNameUseCase should return an ok result in the happy path", async () => {
  const { accountRepo, editAccountName } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await editAccountName.invoke(newCtx(), { accountId: accountMock.id, fullName: "New Name" });

  assert(isOk(result));
});

Deno.test("EditAccountNameUseCase should update the account name in the database in the happy path", async () => {
  const { accountRepo, editAccountName } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await editAccountName.invoke(newCtx(), { accountId: accountMock.id, fullName: "New Name" });

  const result = await accountRepo.getAccountById(newCtx(), accountMock.id);
  assert(isOk(result));
  assertEquals(result.value.fullName, "New Name");
});

Deno.test("EditAccountNameUseCase should audit the name change in the happy path", async () => {
  const { logger, accountRepo, editAccountName } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await editAccountName.invoke(newCtx(), { accountId: accountMock.id, fullName: "New Name" });

  assert(logger.matches("audit log - AccountNameEdited"));
});

Deno.test("EditAccountNameUseCase should return account-not-found if the account did not exist", async () => {
  const { editAccountName } = setup();

  const result = await editAccountName.invoke(newCtx(), { accountId: accountMock.id, fullName: "New Name" });

  assert(isErr(result));
  assertEquals(result.value.kind, "account-not-found");
});

Deno.test("EditAccountNameUseCase should not audit the name change if the account did not exist", async () => {
  const { logger, editAccountName } = setup();

  await editAccountName.invoke(newCtx(), { accountId: accountMock.id, fullName: "New Name" });

  assert(!logger.matches("audit log - AccountNameEdited"));
});
