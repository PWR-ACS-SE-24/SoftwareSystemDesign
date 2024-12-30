import type { Account } from "@jobberknoll/core/domain";
import type { AccountDto } from "~/shared/contracts/account-dto.ts";

export function mapAccountToDto(account: Account): AccountDto {
  const result: AccountDto = {
    id: account.id,
    type: account.type,
    fullName: account.fullName,
    email: account.email,
  };
  if (account.type === "passenger") {
    result.phoneNumber = account.phoneNumber;
  }
  return result;
}
