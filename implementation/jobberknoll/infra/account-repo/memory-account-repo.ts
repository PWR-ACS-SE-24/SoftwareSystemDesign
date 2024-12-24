import type { AccountRepo } from "@jobberknoll/app";
import {
  type Account,
  type AccountNotFoundError,
  accountNotFoundError,
} from "@jobberknoll/core/domain";
import { err, ok, type Result, type UUID } from "@jobberknoll/core/shared";

export class MemoryAccountRepo implements AccountRepo {
  private readonly accounts: Record<UUID, Account> = {};

  public constructor(seeded: Account[] = []) {
    for (const account of seeded) {
      this.accounts[account.id] = account;
    }
  }

  public getAccountById(
    id: UUID,
  ): Promise<Result<Account, AccountNotFoundError>> {
    return Promise.resolve(
      (id in this.accounts && this.accounts[id].isActive)
        ? ok(this.accounts[id])
        : err(accountNotFoundError(id)),
    );
  }
}
