import { accountMock, isErr, isOk, isSome, uuid } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { isPasswordHashed } from "~/security/mod.ts";
import { newCtx } from "~/shared/mod.ts";
import { RegisterUseCase } from "./register-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const register = new RegisterUseCase(logger, accountRepo);
  return { logger, accountRepo, register };
}

const registerReq = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  password: "Password",
  phoneNumber: null,
};

Deno.test("RegisterUseCase should return a new account in the happy path", async () => {
  const { register } = setup();

  const result = await register.invoke(newCtx(), registerReq);

  assert(isOk(result));
  const created = result.value;
  assert(isSome(uuid(created.id)));
  assertEquals(created.type, "passenger");
  assertEquals(created.fullName, registerReq.fullName);
  assertEquals(created.email, registerReq.email);
  assert("hashedPassword" in created);
  assert("lastModified" in created);
});

Deno.test("RegisterUseCase should add the account to the database in the happy path", async () => {
  const { accountRepo, register } = setup();

  const result = await register.invoke(newCtx(), registerReq);
  assert(isOk(result));

  const created = result.value;
  const found = await accountRepo.getAccountById(newCtx(), created.id);
  assert(isOk(found));
  assertEquals(found.value, created);
});

Deno.test("RegisterUseCase should audit the account creation in the happy path", async () => {
  const { logger, register } = setup();

  await register.invoke(newCtx(), registerReq);

  assert(logger.matches("audit log - AccountCreated"));
});

Deno.test("RegisterUseCase should return invalid-account-data if the email is taken", async () => {
  const { accountRepo, register } = setup();
  await accountRepo.createAccount(newCtx(), { ...accountMock, email: registerReq.email });

  const result = await register.invoke(newCtx(), registerReq);
  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-account-data");
});

Deno.test("RegisterUseCase should not audit the account creation if the email is taken", async () => {
  const { logger, accountRepo, register } = setup();
  await accountRepo.createAccount(newCtx(), { ...accountMock, email: registerReq.email });

  await register.invoke(newCtx(), registerReq);

  assert(!logger.matches("audit log - AccountCreated"));
});

Deno.test.ignore("RegisterUseCase should hash the password", async () => {
  const { register } = setup();

  const result = await register.invoke(newCtx(), registerReq);

  assert(isOk(result));
  assert(isPasswordHashed(result.value.hashedPassword));
});

Deno.test.ignore("RegisterUseCase should send a welcome email", async () => {
  // TODO: send the welcome email
});
