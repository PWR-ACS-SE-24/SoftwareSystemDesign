import { accountMock, isErr, ok, uuid } from "@jobberknoll/core/shared";
import { MemoryAccountRepo } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";

Deno.test("GetAccountByIdUseCase should return an account if it exists", async () => {
  const accountRepo = new MemoryAccountRepo([accountMock]);
  const useCase = new GetAccountByIdUseCase(accountRepo);

  const result = await useCase.invoke(accountMock.id);

  assertEquals(result, ok(accountMock));
});

Deno.test(
  "GetAccountByIdUseCase should return account-not-found if the account does not exist",
  async () => {
    const id = uuid();
    const accountRepo = new MemoryAccountRepo();
    const useCase = new GetAccountByIdUseCase(accountRepo);

    const result = await useCase.invoke(id);

    assert(isErr(result));
  },
);

Deno.test("GetAccountByIdUseCase should return account-not-found if the account is inactive", async () => {
  const inactiveAccount = { ...accountMock, isActive: false };
  const accountRepo = new MemoryAccountRepo([inactiveAccount]);
  const useCase = new GetAccountByIdUseCase(accountRepo);

  const result = await useCase.invoke(inactiveAccount.id);

  assert(isErr(result));
});
