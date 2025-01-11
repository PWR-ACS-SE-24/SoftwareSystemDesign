import { accountMock, isErr, ok, uuid } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { newCtx } from "~/shared/ctx.ts";
import { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const getAccountById = new GetAccountByIdUseCase(logger, accountRepo);
  return { logger, accountRepo, getAccountById };
}

Deno.test("GetAccountByIdUseCase should return an account if it exists", async () => {
  const { accountRepo, getAccountById } = setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await getAccountById.invoke(newCtx(), { accountId: accountMock.id });

  assertEquals(result, ok(accountMock));
});

Deno.test("GetAccountByIdUseCase should return account-not-found if the account does not exist", async () => {
  const { getAccountById } = setup();

  const result = await getAccountById.invoke(newCtx(), { accountId: uuid() });

  assert(isErr(result));
  assertEquals(result.value.kind, "account-not-found");
});
