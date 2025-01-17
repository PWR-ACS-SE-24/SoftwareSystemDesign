import { accountMock, isErr, isOk } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { newCtx } from "~/shared/mod.ts";
import { GetAccountByIdUseCase } from "~/use-cases/mod.ts";
import { RevokeTokensUseCase } from "./revoke-tokens-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const getAccountById = new GetAccountByIdUseCase(logger, accountRepo);
  const revokeTokens = new RevokeTokensUseCase(logger, accountRepo, getAccountById);
  return { logger, accountRepo, revokeTokens };
}

Deno.test("RevokeTokensUseCase should return an ok result in the happy path", async () => {
  const { accountRepo, revokeTokens } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await revokeTokens.invoke(newCtx(), { accountId: accountMock.id });

  assert(isOk(result));
});

Deno.test("RevokeTokensUseCase should audit the token revocation in the happy path", async () => {
  const { logger, accountRepo, revokeTokens } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  await revokeTokens.invoke(newCtx(), { accountId: accountMock.id });

  assert(logger.matches("audit log - AccountTokensRevoked"));
});

Deno.test("RevokeTokensUseCase should return account-not-found if the account did not exist", async () => {
  const { revokeTokens } = setup();

  const result = await revokeTokens.invoke(newCtx(), { accountId: accountMock.id });

  assert(isErr(result));
  assertEquals(result.value.kind, "account-not-found");
});

Deno.test("RevokeTokensUseCase should not audit the token revocation if the account did not exist", async () => {
  const { logger, revokeTokens } = setup();

  await revokeTokens.invoke(newCtx(), { accountId: accountMock.id });

  assert(!logger.matches("audit log - AccountTokensRevoked"));
});
