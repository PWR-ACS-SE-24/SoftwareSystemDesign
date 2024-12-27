import type { Result, UUID } from "@jobberknoll/core/shared";
import type { Logger } from "~/shared/mod.ts";

export abstract class UseCase<Req, Res, Err> {
  protected constructor(private readonly logger: Logger) {}

  public async invoke(req: Req, requestId: UUID): Promise<Result<Res, Err>> {
    const method = `${this.constructor.name}#invoke`;
    this.logger.debug(requestId, `${method} - start`, { req: req });
    // TODO @tchojnacki: Add validation
    const res = await this.handle(req);
    this.logger.debug(requestId, `${method} - end`, { res });
    return res;
  }

  protected abstract handle(req: Req): Promise<Result<Res, Err>>;
}
