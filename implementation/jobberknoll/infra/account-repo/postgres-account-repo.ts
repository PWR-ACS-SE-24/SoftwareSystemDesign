import { AccountRepo, type Logger } from "@jobberknoll/app";
import { type Account, type AccountNotFoundError, accountNotFoundError } from "@jobberknoll/core/domain";
import { err, none, ok, type Option, type Result, some, type UUID } from "@jobberknoll/core/shared";
import { Pool } from "postgres";

const POOL_SIZE = 8;

export class PostgresAccountRepo extends AccountRepo {
  private constructor(logger: Logger, private readonly pool: Pool) {
    super(logger);
  }

  public static async setup(logger: Logger, connectionString: string): Promise<AccountRepo> {
    const pool = new Pool(connectionString, POOL_SIZE, true);

    using client = await pool.connect();
    await client.queryObject`
      DO $$ BEGIN
        CREATE TYPE ACCOUNT_TYPE AS ENUM ('admin', 'driver', 'inspector', 'passenger');
      EXCEPTION WHEN DUPLICATE_OBJECT THEN NULL; END $$`;
    await client.queryObject`
      CREATE TABLE IF NOT EXISTS account (
        id UUID PRIMARY KEY,
        type ACCOUNT_TYPE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        hashed_password CHAR(60) NOT NULL,
        last_modified INTEGER NOT NULL,
        phone_number VARCHAR(16),
        CHECK (full_name <> ''),
        CHECK (email <> ''),
        CHECK (phone_number IS NULL OR type = 'passenger')
      )`;

    return new PostgresAccountRepo(logger, pool);
  }

  protected async handleCreateAccount(account: Account): Promise<void> {
    using client = await this.pool.connect();
    await client.queryObject`
      INSERT INTO account (id, type, full_name, email, hashed_password, last_modified, phone_number)
      VALUES (
        ${account.id},
        ${account.type},
        ${account.fullName},
        ${account.email},
        ${account.hashedPassword},
        ${account.lastModified},
        ${"phoneNumber" in account ? account.phoneNumber : null}
      )`;
  }

  protected async handleIsEmailTaken(email: string): Promise<boolean> {
    using client = await this.pool.connect();
    const { rows } = await client.queryObject`SELECT 1 FROM account WHERE email = ${email}`;
    return rows.length > 0;
  }

  protected async handleGetAccountById(id: UUID): Promise<Result<Account, AccountNotFoundError>> {
    using client = await this.pool.connect();
    const { rows } = await client.queryObject<Account>({
      text: `
        SELECT id, type, full_name, email, hashed_password, last_modified, phone_number
        FROM account WHERE id = $id`,
      args: { id },
      camelCase: true,
    });
    return rows.length > 0 ? ok(rows[0]) : err(accountNotFoundError(id));
  }

  protected async handleDeleteAccount(id: UUID): Promise<Option<AccountNotFoundError>> {
    using client = await this.pool.connect();
    const { rows } = await client.queryObject`DELETE FROM account WHERE id = ${id} RETURNING 1`;
    return rows.length > 0 ? none() : some(accountNotFoundError(id));
  }
}
