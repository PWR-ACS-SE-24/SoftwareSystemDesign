import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Result } from "@jobberknoll/core/shared";

export type AccountRepo = {
  getAccountById(id: string): Promise<Result<Account, AccountNotFoundError>>;
};
