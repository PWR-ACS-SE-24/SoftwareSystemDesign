import type { Result } from "@jobberknoll/core/shared";

export abstract class UseCase<Req, Res, Err> {
  public async invoke(req: Req): Promise<Result<Res, Err>> {
    // TODO @tchojnacki: Add validation
    // TODO @tchojnacki: Add logging
    return await this.handle(req);
  }

  protected abstract handle(req: Req): Promise<Result<Res, Err>>;
}
