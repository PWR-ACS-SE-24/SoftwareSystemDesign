import { ok, type Result } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/ctx.ts";
import type { ComponentHealth, SystemHealth } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

export class GetHealthUseCase extends UseCase<null, ComponentHealth, never> {
  public constructor(logger: Logger, private readonly accountRepo: AccountRepo) {
    super(logger);
  }

  protected async handle(_ctx: Ctx, _req: null): Promise<Result<ComponentHealth, never>> {
    const health: SystemHealth = {
      status: "UP",
      components: {
        logger: await this.logger.health(),
        accountRepo: await this.accountRepo.health(),
      },
    };

    for (const component of Object.values(health.components ?? {})) {
      if (component.status === "DOWN") {
        health.status = "DOWN";
        break;
      }
    }

    return ok(health);
  }
}
