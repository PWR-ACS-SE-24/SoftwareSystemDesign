import { accountMock, isErr, isOk } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assert, assertEquals } from "@std/assert";
import { decodeJwt } from "jose";
import { EXPIRES_IN_S_ACCESS, JWT_TYPE_KEY, JwtHandler } from "~/security/mod.ts";
import { newCtx } from "~/shared/mod.ts";
import { LoginUseCase } from "./login-use-case.ts";

async function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const login = new LoginUseCase(logger, accountRepo, jwtHandler);
  return { logger, accountRepo, login };
}

Deno.test("LoginUseCase should return tokens in the happy path", async () => {
  const { accountRepo, login } = await setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await login.invoke(newCtx(), { email: accountMock.email, password: "Password" });

  assert(isOk(result));
  assert("accessToken" in result.value);
  assert("refreshToken" in result.value);
  assertEquals(result.value.tokenType, "Bearer");
  assertEquals(result.value.expiresIn, EXPIRES_IN_S_ACCESS);
});

Deno.test("LoginUseCase should embed account ID in the tokens in the happy path", async () => {
  const { accountRepo, login } = await setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await login.invoke(newCtx(), { email: accountMock.email, password: "Password" });
  assert(isOk(result));
  const { accessToken, refreshToken } = result.value;

  const decodedAccessToken = decodeJwt(accessToken);
  assertEquals(decodedAccessToken.sub, accountMock.id);
  const decodedRefreshToken = decodeJwt(refreshToken);
  assertEquals(decodedRefreshToken.sub, accountMock.id);
});

Deno.test("LoginUseCase should embed account type in the access token in the happy path", async () => {
  const { accountRepo, login } = await setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await login.invoke(newCtx(), { email: accountMock.email, password: "Password" });
  assert(isOk(result));
  const { accessToken } = result.value;

  const decodedAccessToken = decodeJwt(accessToken);
  assertEquals(decodedAccessToken[JWT_TYPE_KEY], accountMock.type);
});

Deno.test("LoginUseCase should return invalid-credentials if the email is incorrect", async () => {
  const { login } = await setup();

  const result = await login.invoke(newCtx(), { email: accountMock.email, password: "Password" });

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-credentials");
});

Deno.test("LoginUseCase should return invalid-credentials if the password is incorrect", async () => {
  const { accountRepo, login } = await setup();
  await accountRepo.createAccount(newCtx(), accountMock);

  const result = await login.invoke(newCtx(), { email: accountMock.email, password: "Invalid-Password" });

  assert(isErr(result));
  assertEquals(result.value.kind, "invalid-credentials");
});
