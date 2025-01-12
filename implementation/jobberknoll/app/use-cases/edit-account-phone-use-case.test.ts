import type { Passenger } from "@jobberknoll/core/domain";
import { accountMock, isOk } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals, assertRejects } from "@std/assert";
import { newCtx } from "~/shared/mod.ts";
import { GetAccountByIdUseCase } from "~/use-cases/mod.ts";
import { EditAccountPhoneUseCase } from "./edit-account-phone-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const getAccountById = new GetAccountByIdUseCase(logger, accountRepo);
  const editAccountPhone = new EditAccountPhoneUseCase(logger, accountRepo, getAccountById);
  return { logger, accountRepo, editAccountPhone };
}

Deno.test("EditAccountPhoneUseCase should return an ok result in the happy path", async () => {
  const { accountRepo, editAccountPhone } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await editAccountPhone.invoke(newCtx(), { accountId: accountMock.id, phoneNumber: "123456789" });

  assert(isOk(result));
});

Deno.test("EditAccountPhoneUseCase should update the account phone in the database in the happy path", async () => {
  for (const phoneNumber of [null, "333333333"]) {
    const { accountRepo, editAccountPhone } = setup();
    await accountRepo.createAccount(newCtx(), accountMock);

    await editAccountPhone.invoke(newCtx(), { accountId: accountMock.id, phoneNumber });

    const result = await accountRepo.getAccountById(newCtx(), accountMock.id);
    assert(isOk(result));
    assertEquals((result.value as Passenger).phoneNumber, phoneNumber);
  }
});

Deno.test("EditAccountPhoneUseCase should audit the phone change in the happy path", async () => {
  const { logger, accountRepo, editAccountPhone } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await editAccountPhone.invoke(newCtx(), { accountId: accountMock.id, phoneNumber: "123456789" });

  assert(logger.matches("audit log - AccountPhoneEdited"));
});

Deno.test("EditAccountPhoneUseCase should return account-not-found if the account did not exist", async () => {
  const { editAccountPhone } = setup();

  const result = await editAccountPhone.invoke(newCtx(), { accountId: accountMock.id, phoneNumber: "123456789" });

  assert(!isOk(result));
  assertEquals(result.value.kind, "account-not-found");
});

Deno.test("EditAccountPhoneUseCase should throw if the account is not a passenger", async () => {
  const { accountRepo, editAccountPhone } = setup();
  await accountRepo.createAccount(newCtx(), { ...accountMock, type: "driver" });

  assertRejects(() => editAccountPhone.invoke(newCtx(), { accountId: accountMock.id, phoneNumber: "123456789" }));
});

Deno.test("EditAccountPhoneUseCase should not audit the phone change if the account did not exist", async () => {
  const { logger, editAccountPhone } = setup();

  await editAccountPhone.invoke(newCtx(), { accountId: accountMock.id, phoneNumber: "123456789" });

  assert(!logger.matches("audit log - AccountPhoneEdited"));
});
