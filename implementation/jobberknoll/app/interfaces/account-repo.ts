import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Result, UUID } from "@jobberknoll/core/shared";

export type AccountRepo = {
  getAccountById(id: UUID): Promise<Result<Account, AccountNotFoundError>>;
};
