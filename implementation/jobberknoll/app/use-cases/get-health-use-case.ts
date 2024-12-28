import { ok, type Result } from "@jobberknoll/core/shared";
import type { Logger, ServiceHealth } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

export class GetHealthUseCase extends UseCase<null, ServiceHealth, never> {
  public constructor(logger: Logger) {
    super(logger);
  }

  protected handle(_: null): Promise<Result<ServiceHealth, never>> {
    return Promise.resolve(ok({ status: "UP" }));
  }
}
