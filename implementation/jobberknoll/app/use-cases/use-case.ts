import type { Result, UUID } from "@jobberknoll/core/shared";
import type { Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/ctx.ts";

export abstract class UseCase<Req, Res, Err> {
  protected constructor(protected readonly logger: Logger) {
    this.invoke = logger.propagate(this, this.handle);
  }

  protected abstract handle(ctx: Ctx, req: Req): Promise<Result<Res, Err>>;
  public readonly invoke: (ctx: Ctx, req: Req) => Promise<Result<Res, Err>>;

  protected audit(eventKind: string, subject: UUID) {
    this.logger.info(null, `audit log - ${eventKind}`, { subject });
  }
}
