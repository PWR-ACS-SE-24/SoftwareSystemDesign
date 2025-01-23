import { isOk } from "@jobberknoll/core/shared";
import { TestLogger } from "@jobberknoll/infra";
import { assert, assertGreaterOrEqual } from "@std/assert";
import { JwtHandler } from "~/security/mod.ts";
import { newCtx } from "~/shared/mod.ts";
import { GetJwksUseCase } from "./get-jwks-use-case.ts";

Deno.test("GetJwksUseCase should return a list of JWKs", async () => {
  const logger = new TestLogger();
  const jwtHandler = await JwtHandler.setupMockForTesting("ES384");
  const getJwks = new GetJwksUseCase(logger, jwtHandler);

  const result = await getJwks.invoke(newCtx(), null);

  assert(isOk(result));
  assertGreaterOrEqual(result.value.keys.length, 1);
});
