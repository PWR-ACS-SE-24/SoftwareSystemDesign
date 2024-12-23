import type { AppError } from "./app-error.ts";

export class AccountNotFoundError implements AppError {
  public constructor(private readonly id: string) {}

  public get kind(): "account-not-found" {
    return "account-not-found";
  }

  public get code(): 404 {
    return 404;
  }

  public get messageEn(): string {
    return `Account with id "${this.id}" was not found!`;
  }

  public get messagePl(): string {
    return `Konto o id "${this.id}" nie zostało znalezione!`;
  }
}
