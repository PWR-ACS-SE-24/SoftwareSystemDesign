# Clabbert

## Requirements

| **Requirement** | **Status** |
| --------------- | ---------- |
| `TIC/01`        | 🟥         |
| `TIC/02`        | 🟥         |
| `TIC/03`        | 🟥         |
| `TIC/04`        | 🟥         |
| `TIC/05`        | 🟥         |
| `TIC/06`        | 🟥         |
| `TIC/07`        | 🟥         |
| `TIC/08`        | 🟥         |
| `TIC/09`        | 🟥         |
| `TIC/10`        | 🟩         |
| `TIC/11`        | 🟥         |
| `TIC/12`        | 🟥         |
| `TIC/13`        | 🟩         |
| `TIC/14`        | 🟩         |
| `TIC/15`        | 🟩         |
| `TIC/16`        | 🟩         |

## API

| **Endpoint**                          | **Status** |
| ------------------------------------- | ---------- |
| `GET    /ext/v1/offers`               | 🟩         |
| `GET    /ext/v1/offers/:id`           | 🟩         |
| `GET    /ext/v1/tickets`              | 🟥         |
| `POST   /ext/v1/tickets`              | 🟥         |
| `GET    /ext/v1/tickets/:id`          | 🟥         |
| `POST   /ext/v1/tickets/:id/validate` | 🟥         |
| `POST   /ext/v1/tickets/:id/inspect`  | 🟥         |
| `POST   /ext/v1/offers`               | 🟩         |
| `PATCH  /ext/v1/offers/:id`           | 🟩         |
| `DELETE /ext/v1/offers/:id`           | 🟩         |
| `GET    /int/v1/health`               | 🟩         |
| `GET    /int/v1/health/:component`    | 🟩         |
| `GET    /int/v1/endpoints`            | 🟥         |

## Infrastructure

| **Integration**             | **Status** |
| --------------------------- | ---------- |
| Database (PostgreSQL)       | 🟩         |
| Leprechaun (REST API)       | 🟥         |
| Inferius (REST API)         | 🟥         |
| Payment messaging (AWS SQS) | 🟥         |
| Logging                     | 🟥         |
