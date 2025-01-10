import { ok, type Result } from "@jobberknoll/core/shared";
import type { Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/ctx.ts";
import type { ServiceHealth } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

export class GetHealthUseCase extends UseCase<null, ServiceHealth, never> {
  public constructor(logger: Logger) {
    super(logger);
  }

  protected handle(_ctx: Ctx, _req: null): Promise<Result<ServiceHealth, never>> {
    // TODO: Fetch infrastructure health.
    return Promise.resolve(ok({ status: "UP" }));
  }
}
