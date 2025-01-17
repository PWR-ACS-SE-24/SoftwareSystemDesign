import { ok, type Result } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { ComponentHealth, Ctx, HealthStatus, SystemHealth } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

export class GetHealthUseCase extends UseCase<null, ComponentHealth, never> {
  public constructor(logger: Logger, private readonly accountRepo: AccountRepo) {
    super(logger);
  }

  protected async handle(_ctx: Ctx, _req: null): Promise<Result<ComponentHealth, never>> {
    const health = {
      status: "UP" as HealthStatus,
      components: {
        logger: await this.logger.health(),
        accountRepo: await this.accountRepo.health(),
      },
    } satisfies SystemHealth;

    for (const component of Object.values(health.components)) {
      if (component.status === "DOWN") {
        health.status = "DOWN";
        break;
      }
    }

    return ok(health);
  }
}
