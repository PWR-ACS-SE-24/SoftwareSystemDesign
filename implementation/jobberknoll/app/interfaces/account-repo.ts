import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Option, Result, UUID } from "@jobberknoll/core/shared";

export type AccountRepo = {
  createAccount(account: Account): Promise<void>;
  isEmailTaken(email: string): Promise<boolean>;
  getAccountById(id: UUID): Promise<Result<Account, AccountNotFoundError>>;
  deleteAccount(id: UUID): Promise<Option<AccountNotFoundError>>;
};
