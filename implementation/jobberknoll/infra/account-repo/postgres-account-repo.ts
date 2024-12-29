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
import { Pool } from "postgres";

// TODO: This entire file is really ugly, but I don't want to make it pretty since I will probably be changing the database schema soon.

type AccountEntity = {
  id: UUID;
  account_type: "A" | "D" | "I" | "P";
  full_name: string;
  email: string;
  hashed_password: string;
  is_active: boolean;
  last_modified: bigint;
  phone_number: string | null;
};

const POOL_SIZE = 4;

const encodeAccountType = (type: Account["type"]): "A" | "D" | "I" | "P" => {
  switch (type) {
    case "admin":
      return "A";
    case "driver":
      return "D";
    case "inspector":
      return "I";
    case "passenger":
      return "P";
  }
};

const decodeAccountType = (type: "A" | "D" | "I" | "P"): Account["type"] => {
  switch (type) {
    case "A":
      return "admin";
    case "D":
      return "driver";
    case "I":
      return "inspector";
    case "P":
      return "passenger";
  }
};

export class PostgresAccountRepo implements AccountRepo {
  private constructor(private readonly pool: Pool) {}

  public static async setup(connectionString: string): Promise<AccountRepo> {
    const pool = new Pool(connectionString, POOL_SIZE, true);

    using client = await pool.connect();
    await client.queryObject`
      CREATE TABLE IF NOT EXISTS account (
        id UUID PRIMARY KEY,
        account_type CHAR(1) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        hashed_password CHAR(60) NOT NULL,
        is_active BOOLEAN NOT NULL,
        last_modified BIGINT NOT NULL,
        phone_number VARCHAR(16),
        CHECK (account_type IN ('A', 'D', 'I', 'P')),
        CHECK (full_name <> ''),
        CHECK (email <> ''),
        CHECK (phone_number IS NULL OR account_type = 'P')
      )`;

    return new PostgresAccountRepo(pool);
  }

  public async createAccount(account: Account): Promise<void> {
    using client = await this.pool.connect();
    await client.queryObject`
      INSERT INTO account (id, account_type, full_name, email, hashed_password, is_active, last_modified, phone_number)
      VALUES (
        ${account.id},
        ${encodeAccountType(account.type)},
        ${account.fullName},
        ${account.email},
        ${account.hashedPassword},
        ${account.isActive},
        ${account.lastModified},
        ${"phoneNumber" in account ? account.phoneNumber : null}
      )`;
  }

  public async isEmailTaken(email: string): Promise<boolean> {
    using client = await this.pool.connect();
    const { rows } = await client
      .queryObject`SELECT 1 FROM account WHERE email = ${email}`;
    return rows.length > 0;
  }

  public async getAccountById(
    id: UUID,
  ): Promise<Result<Account, AccountNotFoundError>> {
    using client = await this.pool.connect();
    const { rows } = await client.queryObject<AccountEntity>`
      SELECT id, account_type, full_name, email, hashed_password, is_active, last_modified, phone_number FROM account WHERE id = ${id}`;
    if (rows.length === 0) {
      return err(accountNotFoundError(id));
    }
    const entity = rows[0];
    const account = {
      id: entity.id,
      type: decodeAccountType(entity.account_type),
      fullName: entity.full_name,
      email: entity.email,
      hashedPassword: entity.hashed_password,
      isActive: entity.is_active,
      lastModified: Number(entity.last_modified),
      ...(entity.phone_number !== null && { phoneNumber: entity.phone_number }),
    };
    return ok(account);
  }

  public async deactivateAccount(
    id: UUID,
  ): Promise<Option<AccountNotFoundError>> {
    using client = await this.pool.connect();
    const { rows } = await client.queryObject`
      UPDATE account SET
        full_name = '[REDACTED]',
        email = ${uuid() + "@redacted.com"},
        hashed_password = '[REDACTED]',
        is_active = false,
        last_modified = ${Date.now()}
      WHERE id = ${id} AND is_active = true
      RETURNING 1`;
    return rows.length > 0 ? none() : some(accountNotFoundError(id));
  }
}
