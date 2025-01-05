import { accountMock, isErr, ok, uuid } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";

Deno.test("GetAccountByIdUseCase should return an account if it exists", async () => {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  await accountRepo.createAccount(accountMock);
  const useCase = new GetAccountByIdUseCase(accountRepo, logger);

  const result = await useCase.invoke({ accountId: accountMock.id }, uuid());

  assertEquals(result, ok(accountMock));
});

Deno.test("GetAccountByIdUseCase should return account-not-found if the account does not exist", async () => {
  const id = uuid();
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const useCase = new GetAccountByIdUseCase(accountRepo, logger);

  const result = await useCase.invoke({ accountId: id }, uuid());

  assert(isErr(result));
});
