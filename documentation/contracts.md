# Contracts respected by all microservices

This file acts as a common place for all contracts which have to be respected by all microservices to ensure they can work together smoothly.

## Healthchecks

Healthchecks to the microservices should be done by calling the `GET /int/v1/health` endpoint. The response should be a `HealthDto` object, conforming to the Spring Boot Actuator health check response format:

- https://docs.spring.io/spring-boot/api/rest/actuator/health.html
- https://docs.spring.io/spring-boot/api/java/org/springframework/boot/actuate/health/Status.html

This should make the implementation easy for Inferius and Clabbert, while also being achievable for TypeScript services. The minimum viable response from the health check should look like this:

```jsonc
// 200 OK
{
  "status": "UP"
}
```

While a more detailed response could look like this:

```jsonc
// 503 Service Unavailable
{
  "status": "DOWN",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "version": "1.0.0",
        "database": "postgres"
      }
    },
    "email": {
      "status": "DOWN", // the main service is down, since this component is down
      "details": {
        "provider": "aws-ses"
      }
    }
  }
}
```

The endpoint should return a `200 OK` if the service is possibly healthy (`UP`, `UNKNOWN`), and a `503 Service Unavailable` if the service is unhealthy (`DOWN`, `OUT_OF_SERVICE`).

## Error schema

The JSON objects returned alongside `4xx` and `5xx` HTTP status codes should follow the following schema:

```TypeScript
type AppError = {
  code: number; // const literal
  kind: string; // const literal, lowercase kebab-case, without trailing "-error"
  messageEn: string;
  messagePl?: string; // optional, required for user-facing errors
};
```

For example:

```jsonc
{
  "code": 404,
  "kind": "account-not-found",
  "messageEn": "Account with ID {0193f896-1452-71d3-8721-64810efa81ae} was not found!",
  "messagePl": "Konto o ID {0193f896-1452-71d3-8721-64810efa81ae} nie zostało znalezione!"
}
```

Well known error codes and kinds are presented below:

<table>
  <tr>
    <th>Code</th>
    <th>Kind</th>
  </tr>
  <tr>
    <th colspan="2">Common</th>
  </tr>
  <tr>
    <td><code>422</code></td>
    <td><code>schema-mismatch</code></td>
  </tr>
  <tr>
    <td><code>500</code></td>
    <td><code>server-failure</code></td>
  </tr>
  <tr>
    <th colspan="2">Jobberknoll</th>
  </tr>
  <tr>
    <td><code>404</code></td>
    <td><code>account-not-found</code></td>
  </tr>
</table>

## Pagination

Pagination follows the [Spring Boot conventions](https://docs.spring.io/spring-data/rest/reference/paging-and-sorting.html). The query parameters are:

- `page` - page number, starting from 0 inclusively (default: 0)
- `size` - page size, starting from 1 inclusively, up to 100 inclusively (default: 10)

Example paginated request looks like this:

```
GET /api/account/v1/accounts?page=2&size=10
```

Invalid pagination request (negative `page`, size `smaller` than 1, `size` bigger than 100) should return a `422` error with the `schema-mismatch` kind.

## Endpoints route

TODO

## Gateway-provided headers

TODO

## Environment variables

TODO
