# Feather

## API

| **Endpoint**          | **Status** |
| --------------------- | ---------- |
| `GET  /int/v1/health` | 🟩         |
| `POST /int/v1/verify` | 🟩         |

## Infrastructure

| **Integration**             | **Status** |
| --------------------------- | ---------- |
| JWKS Provider (Jobberknoll) | 🟩         |
| Logging                     | 🟩         |

## ADRs

- [ADR/001: Vertical partitioning of the Jobberknoll API package structure](../../documentation/adrs/001-jobberknoll-api-structure.md)

## Capabilities

The service requires the following capabilities to be enabled:

- `--allow-net` - required to host the web server
- `--allow-env` - required to read config from environment variables
