import type { Result } from "@jobberknoll/core/shared";
import type { Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/ctx.ts";

export abstract class UseCase<Req, Res, Err> {
  protected constructor(logger: Logger) {
    this.invoke = logger.propagate(this, this.handle);
  }

  protected abstract handle(ctx: Ctx, req: Req): Promise<Result<Res, Err>>;
  public invoke: (ctx: Ctx, req: Req) => Promise<Result<Res, Err>>;
}
