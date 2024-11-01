# Parts of the system divided between team members

```mermaid
flowchart LR
  FRONTEND
  GATEWAY
  TICKET
  PAYMENT
  ACCOUNT
  LOGISTICS

  FRONTEND --> GATEWAY
  GATEWAY --> TICKET
  GATEWAY --> PAYMENT
  GATEWAY --> ACCOUNT
  GATEWAY --> LOGISTICS
  TICKET --> ACCOUNT
  TICKET --> PAYMENT
  TICKET --> LOGISTICS
  PAYMENT --> ACCOUNT
  LOGISTICS --> ACCOUNT
```

| Team Member                                                                 | System part                        |
| --------------------------------------------------------------------------- | ---------------------------------- |
| Tomasz Chojnacki (260365) [@tchojnacki](https://github.com/tchojnacki)      | `ACCOUNT` & `FRONTEND`             |
| Jakub Zehner (260285) [@jakubzehner](https://github.com/jakubzehner)        | `TICKET` & `FRONTEND`              |
| Piotr Kot (259560) [@piterek130](https://github.com/piterek130)             | `PAYMENT` & `GATEWAY` & `FRONTEND` |
| Przemysław Barcicki (260324) [@mlodybercik](https://github.com/mlodybercik) | `LOGISTICS` & `FRONTEND` & DevOps  |

| System Part | Owned entities                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `ACCOUNT`   | `Account`, `Admin`, `Driver`, `Inspector`, `Passenger`                                                      |
| `TICKET`    | `LongTermOffer`, `SingleFareOffer`, `Ticket`, `TicketKind`, `TimeLimitedOffer`, `TicketOffer`, `Validation` |
| `PAYMENT`   | `CreditCardInfo`, `Fine`, `FineReason`, `Wallet`                                                            |
| `LOGISTICS` | `Accident`, `Line`, `Route`, `Stop`, `Vehicle`                                                              |
