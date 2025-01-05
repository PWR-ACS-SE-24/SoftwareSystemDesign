import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Option, Result, UUID } from "@jobberknoll/core/shared";
import type { Logger } from "./logger.ts";

export abstract class AccountRepo {
  public constructor(private readonly logger: Logger) {}

  // TODO: Currently, requestId is not passed to the AccountRepo, because UseCase discards it :(
  private instrument<A extends unknown[], R>(name: string, handler: (...a: A) => Promise<R>): (...a: A) => Promise<R> {
    const method = `${this.constructor.name}#${name}`;
    return async (...args) => {
      this.logger.debug(null, `${method} - start`, { args });

      const res = await handler.bind(this)(...args);

      this.logger.debug(null, `${method} - end`, { res });
      return res;
    };
  }

  protected abstract handleCreateAccount(account: Account): Promise<void>;
  public createAccount = this.instrument("createAccount", this.handleCreateAccount);

  protected abstract handleIsEmailTaken(email: string): Promise<boolean>;
  public isEmailTaken = this.instrument("isEmailTaken", this.handleIsEmailTaken);

  protected abstract handleGetAccountById(id: UUID): Promise<Result<Account, AccountNotFoundError>>;
  public getAccountById = this.instrument("getAccountById", this.handleGetAccountById);

  protected abstract handleDeleteAccount(id: UUID): Promise<Option<AccountNotFoundError>>;
  public deleteAccount = this.instrument("deleteAccount", this.handleDeleteAccount);
}
