import { isNone, isSome, uuid } from "@jobberknoll/core/shared";
import { assert, assertEquals, assertRejects } from "@std/assert";
import { FakeTime } from "@std/testing/time";
import { createLocalJWKSet, decodeJwt, jwtVerify } from "jose";
import { EXPIRES_IN_S_REFRESH } from "~/security/mod.ts";
import { JwtHandler } from "./jwt.ts";

Deno.test("createAccessToken should embed account ID into the payload", async () => {
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();

  const accessToken = await jwtHandler.createAccessToken({ id: accountId, type: "passenger" });

  const payload = decodeJwt(accessToken);
  assertEquals(payload.sub, accountId);
});

Deno.test("createAccessToken should embed account type into the payload", async () => {
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();
  const type = "passenger";

  const accessToken = await jwtHandler.createAccessToken({ id: accountId, type });

  const payload = decodeJwt(accessToken);
  assertEquals(payload["jakprzyjade:account:type"], type);
});

Deno.test("createRefreshToken should embed account ID into the payload", async () => {
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();

  const refreshToken = await jwtHandler.createRefreshToken(accountId);

  const payload = decodeJwt(refreshToken);
  assertEquals(payload.sub, accountId);
});

Deno.test("verifyRefreshToken should accept tokens in the happy path", async () => {
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();
  const refreshToken = await jwtHandler.createRefreshToken(accountId);

  const option = await jwtHandler.verifyRefreshToken(refreshToken);

  assert(isSome(option));
  assertEquals(option.value.accountId, accountId);
});

Deno.test("verifyRefreshToken should reject tokens generated by createAccessToken", async () => {
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();
  const accessToken = await jwtHandler.createAccessToken({ id: accountId, type: "passenger" });

  const option = await jwtHandler.verifyRefreshToken(accessToken);

  assert(isNone(option));
});

Deno.test("verifyRefreshToken should reject expired tokens", async () => {
  using fakeTime = new FakeTime();
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();
  const refreshToken = await jwtHandler.createRefreshToken(accountId);

  await fakeTime.tickAsync(EXPIRES_IN_S_REFRESH * 1000 + 60_000); // 1 minute after expiration
  const option = await jwtHandler.verifyRefreshToken(refreshToken);

  assert(isNone(option));
});

Deno.test("exportJWKS should export a key for veryfing access tokens", async () => {
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();
  const accessToken = await jwtHandler.createAccessToken({ id: accountId, type: "passenger" });

  const jwks = createLocalJWKSet(await jwtHandler.exportJWKS());

  await jwtVerify(accessToken, jwks);
});

Deno.test("exportJWKS should export a key for veryfing refresh tokens", async () => {
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();
  const refreshToken = await jwtHandler.createRefreshToken(accountId);

  const jwks = createLocalJWKSet(await jwtHandler.exportJWKS());

  await jwtVerify(refreshToken, jwks);
});

Deno.test("exportJWKS should export keys sensitive to kid changes", async () => {
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const accountId = uuid();
  const accessToken = await jwtHandler.createAccessToken({ id: accountId, type: "passenger" });

  const exported = await jwtHandler.exportJWKS();
  exported.keys.forEach((k) => k.kid = "invalid");
  const jwks = createLocalJWKSet(exported);

  assertRejects(() => jwtVerify(accessToken, jwks));
});
