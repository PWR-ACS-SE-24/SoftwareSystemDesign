import { accountMock, isErr, isOk, uuid } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { FakeTime } from "@std/testing/time";
import { EXPIRES_IN_S_ACCESS, EXPIRES_IN_S_REFRESH, JwtHandler } from "~/security/mod.ts";
import { newCtx } from "~/shared/mod.ts";
import { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";
import { RefreshUseCase } from "./refresh-use-case.ts";
import { RevokeUseCase } from "./revoke-use-case.ts";

async function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const getAccountById = new GetAccountByIdUseCase(logger, accountRepo);
  const revoke = new RevokeUseCase(logger, accountRepo, getAccountById);
  const refresh = new RefreshUseCase(logger, getAccountById, jwtHandler);
  return { logger, accountRepo, jwtHandler, revoke, refresh };
}

Deno.test("RefreshUseCase should return tokens in the happy path", async () => {
  const { accountRepo, jwtHandler, refresh } = await setup();
  await accountRepo.createAccount(newCtx(), accountMock);
  const refreshToken = await jwtHandler.createRefreshToken(accountMock.id);

  const result = await refresh.invoke(newCtx(), { refreshToken });

  assert(isOk(result));
  assert("accessToken" in result.value);
  assert("refreshToken" in result.value);
  assertEquals(result.value.tokenType, "Bearer");
  assertEquals(result.value.expiresIn, EXPIRES_IN_S_ACCESS);
});

Deno.test("RefreshUseCase should return invalid-credentials if the refresh token is invalid", async () => {
  const { refresh } = await setup();

  const result = await refresh.invoke(newCtx(), { refreshToken: "invalid" });

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-credentials");
});

Deno.test("RefreshUseCase should return invalid-credentials if the refresh token has expired", async () => {
  using fakeTime = new FakeTime();
  const { accountRepo, jwtHandler, refresh } = await setup();
  await accountRepo.createAccount(newCtx(), accountMock);
  const refreshToken = await jwtHandler.createRefreshToken(accountMock.id);

  await fakeTime.tickAsync(EXPIRES_IN_S_REFRESH * 1000 + 60_000); // 1 minute after expiration
  const result = await refresh.invoke(newCtx(), { refreshToken });

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-credentials");
});

Deno.test("RefreshUseCase should return invalid-credentials if the account does not exist", async () => {
  const { jwtHandler, refresh } = await setup();
  const refreshToken = await jwtHandler.createRefreshToken(uuid());

  const result = await refresh.invoke(newCtx(), { refreshToken });

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-credentials");
});

Deno.test("RefreshUseCase should return invalid-credentials if the refresh token was revoked", async () => {
  using fakeTime = new FakeTime();
  const { accountRepo, jwtHandler, revoke, refresh } = await setup();
  await accountRepo.createAccount(newCtx(), accountMock);
  const refreshToken = await jwtHandler.createRefreshToken(accountMock.id);

  await fakeTime.tickAsync(5_000);
  await revoke.invoke(newCtx(), { accountId: accountMock.id });
  const result = await refresh.invoke(newCtx(), { refreshToken });

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-credentials");
});
