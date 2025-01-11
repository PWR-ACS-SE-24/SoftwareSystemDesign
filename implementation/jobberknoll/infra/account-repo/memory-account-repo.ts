import { AccountRepo, type ComponentHealth } from "@jobberknoll/app";
import { type Account, type AccountNotFoundError, accountNotFoundError } from "@jobberknoll/core/domain";
import { err, none, ok, type Option, type Result, some, type UUID } from "@jobberknoll/core/shared";

export class MemoryAccountRepo extends AccountRepo {
  private readonly accounts: Record<UUID, Account> = {};
  private readonly emails: Set<string> = new Set();

  public isHealthy = true;

  public health(): Promise<ComponentHealth> {
    return Promise.resolve({
      status: this.isHealthy ? "UP" : "DOWN",
      details: { implementation: this.constructor.name },
    });
  }

  private ensureHealthy(): void {
    if (!this.isHealthy) {
      throw new Error("MemoryAccountRepo is unhealthy!");
    }
  }

  protected handleCreateAccount(account: Account): Promise<void> {
    this.ensureHealthy();
    if (account.id in this.accounts || this.emails.has(account.email)) {
      return Promise.reject();
    }
    this.accounts[account.id] = account;
    this.emails.add(account.email);
    return Promise.resolve();
  }

  protected handleIsEmailTaken(email: string): Promise<boolean> {
    this.ensureHealthy();
    return Promise.resolve(this.emails.has(email));
  }

  protected handleGetAccountById(id: UUID): Promise<Result<Account, AccountNotFoundError>> {
    this.ensureHealthy();
    return Promise.resolve((id in this.accounts) ? ok(this.accounts[id]) : err(accountNotFoundError(id)));
  }

  protected handleEditAccount(account: Account): Promise<Option<AccountNotFoundError>> {
    this.ensureHealthy();
    if (!(account.id in this.accounts)) {
      return Promise.resolve(some(accountNotFoundError(account.id)));
    }
    this.accounts[account.id] = account;
    return Promise.resolve(none());
  }

  protected handleDeleteAccount(id: UUID): Promise<Option<AccountNotFoundError>> {
    this.ensureHealthy();
    if (!(id in this.accounts)) {
      return Promise.resolve(some(accountNotFoundError(id)));
    }
    this.emails.delete(this.accounts[id].email);
    delete this.accounts[id];
    return Promise.resolve(none());
  }
}
