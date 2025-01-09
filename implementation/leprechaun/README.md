# Leprechaun

## Requirements

| **Requirement** | **Status** |
| --------------- | ---------- |
| `LOG/01`        | 🟨         |
| `LOG/02`        | 🟨         |
| `LOG/03`        | 🟩         |
| `LOG/04`        | 🟩         |
| `LOG/05`        | 🟩         |
| `LOG/06`        | 🟨         |
| `LOG/07`        | 🟨         |
| `LOG/08`        | 🟩         |
| `LOG/09`        | 🟩         |
| `LOG/10`        | 🟩         |
| `LOG/11`        | 🟥         |
| `LOG/12`        | 🟥         |
| `LOG/13`        | 🟥         |
| `LOG/14`        | 🟥         |
| `LOG/15`        | 🟥         |
| `LOG/16`        | 🟩         |
| `LOG/17`        | 🟩         |
| `LOG/18`        | 🟩         |
| `LOG/19`        | 🟩         |
| `LOG/20`        | 🟥         |
| `LOG/21`        | 🟥         |
| `LOG/22`        | 🟥         |
| `LOG/23`        | 🟥         |
| `LOG/24`        | 🟥         |
| `LOG/25`        | 🟥         |
| `LOG/26`        | 🟥         |
| `LOG/27`        | 🟥         |

| **Endpoint**                   | **Status** |
| ------------------------------ | ---------- |
| `GET    /ext/v1/lines`         | 🟨         |
| `GET    /ext/v1/lines/:id`     | 🟩         |
| `POST   /ext/v1/lines`         | 🟩         |
| `PATCH  /ext/v1/lines/:id`     | 🟩         |
| `DELETE /ext/v1/lines/:id`     | 🟩         |
| `GET    /ext/v1/stops`         | 🟨         |
| `GET    /ext/v1/stops/:id`     | 🟩         |
| `POST   /ext/v1/stops`         | 🟩         |
| `PATCH  /ext/v1/stops/:id`     | 🟩         |
| `DELETE /ext/v1/stops/:id`     | 🟩         |
| `GET    /ext/v1/routes`        | 🟥         |
| `GET    /ext/v1/routes/:id`    | 🟥         |
| `POST   /ext/v1/routes`        | 🟥         |
| `PATCH  /ext/v1/routes/:id`    | 🟥         |
| `DELETE /ext/v1/routes/:id`    | 🟥         |
| `GET    /ext/v1/vehicles`      | 🟨         |
| `GET    /ext/v1/vehicles/:id`  | 🟩         |
| `POST   /ext/v1/vehicles`      | 🟩         |
| `PATCH  /ext/v1/vehicles/:id`  | 🟩         |
| `DELETE /ext/v1/vehicles/:id`  | 🟩         |
| `GET    /ext/v1/accidents`     | 🟥         |
| `GET    /ext/v1/accidents/:id` | 🟥         |
| `POST   /ext/v1/accidents`     | 🟥         |
| `PATCH  /ext/v1/accidents/:id` | 🟥         |

## TODOs

- Set up CI/CD
- We probably need explicit transactins in some places when doing more than single operation.
- Make E2E tests for all endpoints.
