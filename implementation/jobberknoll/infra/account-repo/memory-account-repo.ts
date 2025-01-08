import { AccountRepo } from "@jobberknoll/app";
import { type Account, type AccountNotFoundError, accountNotFoundError } from "@jobberknoll/core/domain";
import { err, none, ok, type Option, type Result, some, type UUID } from "@jobberknoll/core/shared";

export class MemoryAccountRepo extends AccountRepo {
  private readonly accounts: Record<UUID, Account> = {};
  private readonly emails: Set<string> = new Set();

  protected handleCreateAccount(account: Account): Promise<void> {
    if (account.id in this.accounts || this.emails.has(account.email)) {
      return Promise.reject();
    }
    this.accounts[account.id] = account;
    this.emails.add(account.email);
    return Promise.resolve();
  }

  protected handleIsEmailTaken(email: string): Promise<boolean> {
    return Promise.resolve(this.emails.has(email));
  }

  protected handleGetAccountById(id: UUID): Promise<Result<Account, AccountNotFoundError>> {
    return Promise.resolve((id in this.accounts) ? ok(this.accounts[id]) : err(accountNotFoundError(id)));
  }

  protected handleDeleteAccount(id: UUID): Promise<Option<AccountNotFoundError>> {
    if (id in this.accounts) {
      this.emails.delete(this.accounts[id].email);
      delete this.accounts[id];
      return Promise.resolve(none());
    }
    return Promise.resolve(some(accountNotFoundError(id)));
  }
}
