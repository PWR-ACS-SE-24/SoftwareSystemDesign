# Jobberknoll

## Requirements

| **Requirement** | **Status** |
| --------------- | ---------- |
| `ACC/01`        | 🟩         |
| `ACC/02`        | 🟩         |
| `ACC/04`        | 🟩         |
| `ACC/05`        | 🟩         |
| `ACC/06`        | 🟩         |
| `ACC/10`        | 🟩         |
| `ACC/11`        | 🟩         |
| `ACC/12`        | 🟩         |
| `ACC/13`        | 🟥         |
| `ACC/14`        | 🟩         |
| `ACC/15`        | 🟩         |
| `ACC/16`        | 🟩         |

## API

| **Endpoint**                   | **Status** |
| ------------------------------ | ---------- |
| `POST   /ext/v1/register`      | 🟩         |
| `POST   /ext/v1/login`         | 🟩         |
| `POST   /ext/v1/refresh`       | 🟩         |
| `POST   /ext/v1/revoke`        | 🟩         |
| `GET    /ext/v1/self`          | 🟩         |
| `PUT    /ext/v1/self/name`     | 🟩         |
| `PUT    /ext/v1/self/password` | 🟩         |
| `PUT    /ext/v1/self/phone`    | 🟩         |
| `DELETE /ext/v1/self`          | 🟩         |
| `POST   /ext/v1/accounts`      | 🟩         |
| `GET    /ext/v1/accounts`      | 🟥         |
| `GET    /ext/v1/accounts/:id`  | 🟩         |
| `DELETE /ext/v1/accounts/:id`  | 🟩         |
| `GET    /int/v1/health`        | 🟩         |
| `GET    /int/v1/endpoints`     | 🟩         |
| `GET    /int/v1/accounts/:id`  | 🟩         |
| `GET    /int/v1/jwks`          | 🟩         |

## Infrastructure

| **Integration**                 | **Status** |
| ------------------------------- | ---------- |
| Account Repository (PostgreSQL) | 🟩         |
| Email Sending Service (AWS SQS) | 🟥         |
| Logging                         | 🟩         |

## ADRs

- [ADR/001: Vertical partitioning of the Jobberknoll API package structure](../../documentation/adrs/001-jobberknoll-api-structure.md)
- [ADR/002: Domain model and database schema changes for Jobberknoll](../../documentation/adrs/002-jobberknoll-domain-model.md)
- [ADR/003: Password hashing and storage requirements for Jobberknoll](../../documentation/adrs/003-password-hashing.md)

## Capabilities

The service requires the following capabilities to be enabled:

- `--allow-ffi` - required for Argon2id
- `--allow-net` - required to host the web server
- `--allow-env` - required to read config from environment variables
