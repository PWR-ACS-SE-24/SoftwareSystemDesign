# Inferius

## Requirements

| **Requirement** | **Status** |
|-----------------| ---------- |
| `PAY/02`        | 🟩         |
| `PAY/03`        | 🟩         |
| `PAY/07`        | 🟥         |
| `PAY/08`        | 🟩         |
| `PAY/09`        | 🟩         |
| `PAY/10`        | 🟥         |
| `PAY/14`        | 🟥         |
| `PAY/15`        | 🟥         |
| `PAY/16`        | 🟥         |
| `PAY/17`        | 🟩         |
| `PAY/18`        | 🟩         |
| `PAY/19`        | 🟩         |
| `PAY/20`        | 🟩         |
| `PAY/21`        | 🟩         |
| `PAY/22`        | 🟩         |
| `PAY/23`        | 🟩         |

## API

| **Endpoint**                       | **Status** |
|------------------------------------| ---------- |
| `GET    /ext/v1/cards`             | 🟩         |
| `POST   /ext/v1/cards`             | 🟩         |
| `PUT    /ext/v1/cards/:id`         | 🟩         |
| `DELETE /ext/v1/cards/:id`         | 🟩         |
| `POST   /ext/v1/wallet/add-funds`  | 🟥         |
| `GET    /ext/v1/wallet`            | 🟩         |
| `GET    /ext/v1/wallet/history`    | 🟩         |
| `GET    /ext/v1/transations`       | 🟥         |
| `GET    /ext/v1/fines`             | 🟩         |
| `GET    /ext/v1/fines/:id`         | 🟩         |
| `POST   /ext/v1/fines/:id/pay`     | 🟥         |
| `POST   /ext/v1/fines`             | 🟩         |
| `PUT    /ext/v1/fines/:id/cancel`  | 🟩         |
| `GET    /int/v1/health`            | 🟩         |
| `GET    /int/v1/health/:component` | 🟩         |
| `GET    /int/v1/endpoints`         | 🟥         |

## Infrastructure

| **Integration**             | **Status** |
|-----------------------------|------------|
| Database (PostgreSQL)       | 🟩         |
| Payment messaging (AWS SQS) | 🟥         |
| Payment gateway (Tpay)      | 🟥         |