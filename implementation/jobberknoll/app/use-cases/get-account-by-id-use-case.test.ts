import { accountMock, isErr, ok, uuid } from "@jobberknoll/core/shared";
import { MemoryAccountRepo } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { Logger } from "~/shared/mod.ts";
import { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";

Deno.test("GetAccountByIdUseCase should return an account if it exists", async () => {
  const accountRepo = new MemoryAccountRepo([accountMock]);
  const useCase = new GetAccountByIdUseCase(accountRepo, new Logger());

  const result = await useCase.invoke({ accountId: accountMock.id }, uuid());

  assertEquals(result, ok(accountMock));
});

Deno.test(
  "GetAccountByIdUseCase should return account-not-found if the account does not exist",
  async () => {
    const id = uuid();
    const accountRepo = new MemoryAccountRepo();
    const useCase = new GetAccountByIdUseCase(accountRepo, new Logger());

    const result = await useCase.invoke({ accountId: id }, uuid());

    assert(isErr(result));
  },
);

Deno.test("GetAccountByIdUseCase should return account-not-found if the account is inactive", async () => {
  const inactiveAccount = { ...accountMock, isActive: false };
  const accountRepo = new MemoryAccountRepo([inactiveAccount]);
  const useCase = new GetAccountByIdUseCase(accountRepo, new Logger());

  const result = await useCase.invoke(
    { accountId: inactiveAccount.id },
    uuid(),
  );

  assert(isErr(result));
});
