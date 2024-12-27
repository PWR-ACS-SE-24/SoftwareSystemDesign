# Contracts respected by all microservices

This file acts as a common place for all contracts which have to be respected by all microservices to ensure they can work together smoothly.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.txt).

## Healthchecks

Healthchecks to the microservices MUST be done by calling the `GET /int/v1/health` endpoint. The response SHOULD be a `HealthDto` object, conforming to the Spring Boot Actuator health check response format:

- https://docs.spring.io/spring-boot/api/rest/actuator/health.html
- https://docs.spring.io/spring-boot/api/java/org/springframework/boot/actuate/health/Status.html

This will make the implementation easy for Inferius and Clabbert, while also being achievable for TypeScript services. The minimum viable response from the health check could look like this:

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

The endpoint MUST return a `200 OK` if the service is possibly healthy (`UP`, `UNKNOWN`), and a `503 Service Unavailable` if the service is unhealthy (`DOWN`, `OUT_OF_SERVICE`).

## Error schema

The JSON objects returned alongside `4xx` and `5xx` HTTP status codes SHOULD follow the following schema:

```JSONC
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AppError",
  "description": "API error responses for the JakPrzyjade system.",
  "type": "object",
  "readOnly": true,
  "properties": {
    "code": { // due to layer separation, we should pretend that this is not HTTP-related, but truly, it is
      "type": "integer",
      "description": "HTTP error status code.",
      "minimum": 400,
      "maximum": 599
    },
    "kind": { // identifier for the error, used for logging and client-side error handling
      "type": "string",
      "description": "Error kind, lowercase kebab-case, without trailing '-error'.",
      "maxLength": 255,
      "pattern": "^[a-z]+(-[a-z]+)*$" // kebab-case
    },
    "messageEn": { // human-readable error message in English
      "type": "string",
      "description": "Error message in English."
    },
    "messagePl": { // human-readable error message in Polish, only required for user-facing errors
      "type": "string",
      "description": "Error message in Polish."
    }
  },
  "required": ["code", "kind", "messageEn"] // "messagePl" is optional
}
```

For example:

```JSONC
{
  "code": 404,
  "kind": "account-not-found",
  "messageEn": "Account with ID {0193f896-1452-71d3-8721-64810efa81ae} was not found!",
  "messagePl": "Konto o ID {0193f896-1452-71d3-8721-64810efa81ae} nie zostało znalezione!"
}
```

Which translates to the following types in the languages used in the project:

```TypeScript
type AppError = {
  code: number; // const literal
  kind: string; // const literal
  messageEn: string;
  messagePl?: string;
};
```

```Java
@Data
@AllArgsConstructor
public class AppError {
    @NotNull private final int code;
    @NotNull private final String kind;
    @NotNull private final String messageEn;
    private final String messagePl;
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
    <td><code>401</code></td>
    <td><code>user-unauthorized</code></td>
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
  <tr>
    <th colspan="2">Clabbert</th>
  </tr>
  <tr>
    <td><code>400</code></td>
    <td><code>user-id-header-missing</code></td>
  </tr>
  <tr>
    <td><code>400</code></td>
    <td><code>user-id-header-not-valid</code></td>
  </tr>
  <tr>
    <td><code>400</code></td>
    <td><code>user-role-header-missing</code></td>
  </tr>
  <tr>
    <td><code>400</code></td>
    <td><code>user-role-not-supported</code></td>
  </tr>
</table>

## Pagination

Pagination SHOULD follow the [Spring Boot conventions](https://docs.spring.io/spring-data/rest/reference/paging-and-sorting.html). The query parameters are:

- `page` - page number, starting from 0 inclusively (default: 0)
- `size` - page size, starting from 1 inclusively, up to 100 inclusively (default: 10)

Example paginated request looks like this:

```
GET /api/account/v1/accounts?page=2&size=10
```

Invalid pagination request (negative `page`, size `smaller` than 1, `size` bigger than 100) SHOULD return a `422` error with the `schema-mismatch` kind.

## Endpoints route

TODO

## Headers

TODO

## Environment variables

TODO
