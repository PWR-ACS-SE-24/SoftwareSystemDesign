import type { AccountRepo } from "@jobberknoll/app";
import {
  type Account,
  type AccountNotFoundError,
  accountNotFoundError,
} from "@jobberknoll/core/domain";
import { err, ok, type Result, type UUID } from "@jobberknoll/core/shared";

export class MemoryAccountRepo implements AccountRepo {
  public constructor(private readonly accounts: Record<UUID, Account> = {}) {}

  public getAccountById(
    id: UUID,
  ): Promise<Result<Account, AccountNotFoundError>> {
    return Promise.resolve(
      id in this.accounts
        ? ok(this.accounts[id])
        : err(accountNotFoundError(id)),
    );
  }
}
