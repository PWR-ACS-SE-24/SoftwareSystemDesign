import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Option, Result, UUID } from "@jobberknoll/core/shared";
import type { Monitorable } from "~/interfaces/mod.ts";
import type { ComponentHealth, Ctx } from "~/shared/mod.ts";
import type { Logger } from "./logger.ts";

export abstract class AccountRepo implements Monitorable {
  public constructor(logger: Logger) {
    this.createAccount = logger.instrument(this, this.handleCreateAccount);
    this.isEmailTaken = logger.instrument(this, this.handleIsEmailTaken);
    this.getAccountById = logger.instrument(this, this.handleGetAccountById);
    this.editAccount = logger.instrument(this, this.handleEditAccount);
    this.deleteAccount = logger.instrument(this, this.handleDeleteAccount);
  }

  public abstract health(): Promise<ComponentHealth>;

  protected abstract handleCreateAccount(account: Account): Promise<void>;
  public readonly createAccount: (ctx: Ctx, account: Account) => Promise<void>;

  protected abstract handleIsEmailTaken(email: string): Promise<boolean>;
  public readonly isEmailTaken: (ctx: Ctx, email: string) => Promise<boolean>;

  protected abstract handleGetAccountById(id: UUID): Promise<Result<Account, AccountNotFoundError>>;
  public readonly getAccountById: (ctx: Ctx, id: UUID) => Promise<Result<Account, AccountNotFoundError>>;

  protected abstract handleEditAccount(account: Account): Promise<void>;
  public readonly editAccount: (ctx: Ctx, account: Account) => Promise<void>;

  protected abstract handleDeleteAccount(id: UUID): Promise<Option<AccountNotFoundError>>;
  public readonly deleteAccount: (ctx: Ctx, id: UUID) => Promise<Option<AccountNotFoundError>>;
}
