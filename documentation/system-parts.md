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
  PAYMENT --> ACCOUNT
  LOGISTICS --> ACCOUNT
```

- Tomasz Chojnacki (260365) @tchojnacki - `ACCOUNT`
- Jakub Zehner (260285) @jakubzehner - `TICKET`
- Piotr Kot (259560) @piterek130 - `PAYMENT` & `GATEWAY`
- Przemysław Barcicki (260324) @mlodybercik - `LOGISTICS` & DevOps
