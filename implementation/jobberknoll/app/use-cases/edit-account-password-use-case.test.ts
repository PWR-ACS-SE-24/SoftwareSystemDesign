import { accountMock, isErr, isOk } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { isPasswordHashed } from "~/security/mod.ts";
import { newCtx } from "~/shared/mod.ts";
import { GetAccountByIdUseCase } from "~/use-cases/mod.ts";
import { EditAccountPasswordUseCase } from "./edit-account-password-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const getAccountById = new GetAccountByIdUseCase(logger, accountRepo);
  const editAccountPassword = new EditAccountPasswordUseCase(logger, accountRepo, getAccountById);
  return { logger, accountRepo, editAccountPassword };
}

Deno.test("EditAccountPasswordUseCase should return an ok result in the happy path", async () => {
  const { accountRepo, editAccountPassword } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Password",
    newPassword: "New-Password",
  });

  assert(isOk(result));
});

Deno.test("EditAccountPasswordUseCase should update the account password in the database in the happy path", async () => {
  const { accountRepo, editAccountPassword } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Password",
    newPassword: "New-Password",
  });

  const result = await accountRepo.getAccountById(newCtx(), accountMock.id);
  assert(isOk(result));
  assertNotEquals(result.value.hashedPassword, accountMock.hashedPassword);
});

Deno.test("EditAccountPasswordUseCase should audit the password change in the happy path", async () => {
  const { logger, accountRepo, editAccountPassword } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Password",
    newPassword: "New-Password",
  });

  assert(logger.matches("audit log - AccountPasswordEdited"));
});

Deno.test("EditAccountPasswordUseCase should return account-not-found if the account did not exist", async () => {
  const { editAccountPassword } = setup();

  const result = await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Password",
    newPassword: "New-Password",
  });

  assert(isErr(result));
  assertEquals(result.value.kind, "account-not-found");
});

Deno.test("EditAccountPasswordUseCase should not audit the password change if the account did not exist", async () => {
  const { logger, editAccountPassword } = setup();

  await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Password",
    newPassword: "New-Password",
  });

  assert(!logger.matches("audit log - AccountPasswordEdited"));
});

Deno.test("EditAccountPasswordUseCase should return invalid-account-data if the old password is incorrect", async () => {
  const { accountRepo, editAccountPassword } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Wrong-Password",
    newPassword: "New-Password",
  });

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-account-data");
});

Deno.test("EditAccountPasswordUseCase should not audit the password change if the old password is incorrect", async () => {
  const { logger, accountRepo, editAccountPassword } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Wrong-Password",
    newPassword: "New-Password",
  });

  assert(!logger.matches("audit log - AccountPasswordEdited"));
});

Deno.test("EditAccountPasswordUseCase should return invalid-account-data if the new password is the same as the old password", async () => {
  const { accountRepo, editAccountPassword } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Password",
    newPassword: "Password",
  });

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-account-data");
});

Deno.test("EditAccountPasswordUseCase should not audit the password change if the new password is the same as the old password", async () => {
  const { logger, accountRepo, editAccountPassword } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Password",
    newPassword: "Password",
  });

  assert(!logger.matches("audit log - AccountPasswordEdited"));
});

Deno.test("EditAccountPasswordUseCase should hash the password", async () => {
  const { accountRepo, editAccountPassword } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await editAccountPassword.invoke(newCtx(), {
    accountId: accountMock.id,
    oldPassword: "Password",
    newPassword: "New-Password",
  });

  const account = await accountRepo.getAccountById(newCtx(), accountMock.id);
  assert(isOk(account));
  assert(isPasswordHashed(account.value.hashedPassword));
});

Deno.test.ignore("EditAccountPasswordUseCase should send the password change email", async () => {
  // TODO: send the password change email
});
