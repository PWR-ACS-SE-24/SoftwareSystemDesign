import type { Account } from "@jobberknoll/core/domain";
import type { AccountDto } from "~/shared/contracts/account-dto.ts";

export function mapAccountToDto(account: Account): AccountDto {
  return ({
    id: account.id,
    type: account.type,
    fullName: account.fullName,
    email: account.email,
    phoneNumber: account.type === "passenger" ? account.phoneNumber : undefined,
  });
}
