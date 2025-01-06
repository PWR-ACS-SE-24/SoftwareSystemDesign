import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Option, Result, UUID } from "@jobberknoll/core/shared";
import type { Ctx } from "../shared/ctx.ts";
import type { Logger } from "./logger.ts";

export abstract class AccountRepo {
  public constructor(logger: Logger) {
    this.createAccount = logger.instrument(this, this.handleCreateAccount);
    this.isEmailTaken = logger.instrument(this, this.handleIsEmailTaken);
    this.getAccountById = logger.instrument(this, this.handleGetAccountById);
    this.deleteAccount = logger.instrument(this, this.handleDeleteAccount);
  }

  protected abstract handleCreateAccount(account: Account): Promise<void>;
  public createAccount: (ctx: Ctx, account: Account) => Promise<void>;

  protected abstract handleIsEmailTaken(email: string): Promise<boolean>;
  public isEmailTaken: (ctx: Ctx, email: string) => Promise<boolean>;

  protected abstract handleGetAccountById(id: UUID): Promise<Result<Account, AccountNotFoundError>>;
  public getAccountById: (ctx: Ctx, id: UUID) => Promise<Result<Account, AccountNotFoundError>>;

  protected abstract handleDeleteAccount(id: UUID): Promise<Option<AccountNotFoundError>>;
  public deleteAccount: (ctx: Ctx, id: UUID) => Promise<Option<AccountNotFoundError>>;
}
