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

| Team Member                                                                 | System Part           |
| --------------------------------------------------------------------------- | --------------------- |
| Tomasz Chojnacki (260365) [@tchojnacki](https://github.com/tchojnacki)      | `ACCOUNT` & `FRONTEND`             |
| Jakub Zehner (260285) [@jakubzehner](https://github.com/jakubzehner)        | `TICKET` & `FRONTEND`              |
| Piotr Kot (259560) [@piterek130](https://github.com/piterek130)             | `PAYMENT` & `GATEWAY` & `FRONTEND` |
| Przemysław Barcicki (260324) [@mlodybercik](https://github.com/mlodybercik) | `LOGISTICS` & `FRONTEND` & DevOps  |
