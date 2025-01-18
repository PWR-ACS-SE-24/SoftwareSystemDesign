import { ok, type Result } from "@jobberknoll/core/shared";
import type { JSONWebKeySet } from "jose";
import type { Logger } from "~/interfaces/mod.ts";
import type { JwtHandler } from "~/security/mod.ts";
import type { Ctx } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

export class GetJwksUseCase extends UseCase<null, JSONWebKeySet, never> {
  public constructor(logger: Logger, private readonly jwtHandler: JwtHandler) {
    super(logger);
  }

  protected async handle(_ctx: Ctx, _req: null): Promise<Result<JSONWebKeySet, never>> {
    return ok(await this.jwtHandler.exportJWKS());
  }
}
