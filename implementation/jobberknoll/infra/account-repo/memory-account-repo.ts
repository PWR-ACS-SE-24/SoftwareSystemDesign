import type { AccountRepo } from "@jobberknoll/app";
import {
  type Account,
  type AccountNotFoundError,
  accountNotFoundError,
} from "@jobberknoll/core/domain";
import {
  err,
  none,
  ok,
  type Option,
  type Result,
  some,
  type UUID,
  uuid,
} from "@jobberknoll/core/shared";

export class MemoryAccountRepo implements AccountRepo {
  private readonly accounts: Record<UUID, Account> = {};
  private readonly emails: Set<string> = new Set();

  public createAccount(account: Account): Promise<void> {
    if (account.id in this.accounts || this.emails.has(account.email)) {
      return Promise.reject();
    }
    this.accounts[account.id] = account;
    this.emails.add(account.email);
    return Promise.resolve();
  }

  public isEmailTaken(email: string): Promise<boolean> {
    return Promise.resolve(this.emails.has(email));
  }

  public getAccountById(
    id: UUID,
  ): Promise<Result<Account, AccountNotFoundError>> {
    return Promise.resolve(
      (id in this.accounts)
        ? ok(this.accounts[id])
        : err(accountNotFoundError(id)),
    );
  }

  public deactivateAccount(
    id: UUID,
  ): Promise<Option<AccountNotFoundError>> {
    if (id in this.accounts && this.accounts[id].isActive) {
      // TODO: Think about what account deactivation should actually do.
      // TODO: Move to /app/security.
      this.emails.delete(this.accounts[id].email);
      this.accounts[id].fullName = "[REDACTED]";
      this.accounts[id].email = `${uuid()}@redacted.com`;
      this.accounts[id].hashedPassword = "[REDACTED]";
      this.accounts[id].isActive = false;
      this.accounts[id].lastModified = Date.now();
      this.emails.add(this.accounts[id].email);
      return Promise.resolve(none());
    }
    return Promise.resolve(some(accountNotFoundError(id)));
  }
}
