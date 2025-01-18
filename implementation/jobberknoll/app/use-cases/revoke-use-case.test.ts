import { accountMock, isErr, isOk } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { newCtx } from "~/shared/mod.ts";
import { GetAccountByIdUseCase } from "~/use-cases/mod.ts";
import { RevokeUseCase } from "./revoke-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const getAccountById = new GetAccountByIdUseCase(logger, accountRepo);
  const revoke = new RevokeUseCase(logger, accountRepo, getAccountById);
  return { logger, accountRepo, revoke };
}

Deno.test("RevokeUseCase should return an ok result in the happy path", async () => {
  const { accountRepo, revoke } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await revoke.invoke(newCtx(), { accountId: accountMock.id });

  assert(isOk(result));
});

Deno.test("RevokeUseCase should audit the token revocation in the happy path", async () => {
  const { logger, accountRepo, revoke } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await revoke.invoke(newCtx(), { accountId: accountMock.id });

  assert(logger.matches("audit log - AccountTokensRevoked"));
});

Deno.test("RevokeUseCase should return account-not-found if the account did not exist", async () => {
  const { revoke } = setup();

  const result = await revoke.invoke(newCtx(), { accountId: accountMock.id });

  assert(isErr(result));
  assertEquals(result.value.kind, "account-not-found");
});

Deno.test("RevokeUseCase should not audit the token revocation if the account did not exist", async () => {
  const { logger, revoke } = setup();

  await revoke.invoke(newCtx(), { accountId: accountMock.id });

  assert(!logger.matches("audit log - AccountTokensRevoked"));
});
