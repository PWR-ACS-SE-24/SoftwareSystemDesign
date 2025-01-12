import { accountMock, isErr, isOk, isSome, uuid } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { newCtx } from "~/shared/mod.ts";
import { CreateAccountUseCase } from "./create-account-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const createAccount = new CreateAccountUseCase(logger, accountRepo);
  return { logger, accountRepo, createAccount };
}

const createAccountReq = {
  type: "driver" as const,
  fullName: "John Doe",
  email: "john.doe@example.com",
  password: "Password",
};

Deno.test("CreateAccountUseCase should return a new account in the happy path", async () => {
  const { createAccount } = setup();

  const result = await createAccount.invoke(newCtx(), createAccountReq);

  assert(isOk(result));
  const created = result.value;
  assert(isSome(uuid(created.id)));
  assertEquals(created.type, createAccountReq.type);
  assertEquals(created.fullName, createAccountReq.fullName);
  assertEquals(created.email, createAccountReq.email);
  assert("hashedPassword" in created);
  assert("lastModified" in created);
});

Deno.test("CreateAccountUseCase should add the account to the database in the happy path", async () => {
  const { accountRepo, createAccount } = setup();

  const result = await createAccount.invoke(newCtx(), createAccountReq);
  assert(isOk(result));

  const created = result.value;
  const found = await accountRepo.getAccountById(newCtx(), created.id);
  assert(isOk(found));
  assertEquals(found.value, created);
});

Deno.test("CreateAccountUseCase should audit the account creation in the happy path", async () => {
  const { logger, createAccount } = setup();

  await createAccount.invoke(newCtx(), createAccountReq);

  assert(logger.matches("audit log - AccountCreated"));
});

Deno.test("CreateAccountUseCase should return invalid-account-data if the email is taken", async () => {
  const { accountRepo, createAccount } = setup();
  await accountRepo.createAccount(newCtx(), { ...accountMock, email: createAccountReq.email });

  const result = await createAccount.invoke(newCtx(), createAccountReq);

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-account-data");
});

Deno.test("CreateAccountUseCase should not audit the account creation if the email is taken", async () => {
  const { logger, accountRepo, createAccount } = setup();
  await accountRepo.createAccount(newCtx(), { ...accountMock, email: createAccountReq.email });

  await createAccount.invoke(newCtx(), createAccountReq);

  assert(!logger.matches("audit log - AccountCreated"));
});

Deno.test.ignore("CreateAccountUseCase should hash the password", async () => {
  // TODO: hash the password
});

Deno.test.ignore("CreateAccountUseCase should send the welcome email", async () => {
  // TODO: send the welcome email
});
