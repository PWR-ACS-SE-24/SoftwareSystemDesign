import { accountMock, isErr, ok, uuid } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { newCtx } from "~/shared/ctx.ts";
import { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";

Deno.test("GetAccountByIdUseCase should return an account if it exists", async () => {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  await accountRepo.createAccount(newCtx(), accountMock);
  const useCase = new GetAccountByIdUseCase(logger, accountRepo);

  const result = await useCase.invoke(newCtx(), { accountId: accountMock.id });

  assertEquals(result, ok(accountMock));
});

Deno.test("GetAccountByIdUseCase should return account-not-found if the account does not exist", async () => {
  const id = uuid();
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const useCase = new GetAccountByIdUseCase(logger, accountRepo);

  const result = await useCase.invoke(newCtx(), { accountId: id });

  assert(isErr(result));
});
