import { isOk } from "@jobberknoll/core/shared";
import { MemoryAccountRepo, TestLogger } from "@jobberknoll/infra";
import { assertObjectMatch } from "@std/assert";
import { assert } from "@std/assert/assert";
import { newCtx } from "~/mod.ts";
import { GetHealthUseCase } from "./get-health-use-case.ts";

function setup() {
  const logger = new TestLogger();
  const accountRepo = new MemoryAccountRepo(logger);
  const getHealth = new GetHealthUseCase(logger, accountRepo);
  return { logger, accountRepo, getHealth };
}

Deno.test("GetHealthUseCase should return the service health", async () => {
  const { getHealth } = setup();

  const result = await getHealth.invoke(newCtx(), null);

  assert(isOk(result));
  assertObjectMatch(result.value, {
    status: "UP",
    components: {
      accountRepo: { status: "UP" },
      logger: { status: "UP" },
    },
  });
});

Deno.test("GetHealthUseCase should react to a failing component", async () => {
  const { accountRepo, getHealth } = setup();
  accountRepo.isHealthy = false;

  const result = await getHealth.invoke(newCtx(), null);

  assert(isOk(result));
  assertObjectMatch(result.value, {
    status: "DOWN",
    components: {
      accountRepo: { status: "DOWN" },
      logger: { status: "UP" },
    },
  });
});
