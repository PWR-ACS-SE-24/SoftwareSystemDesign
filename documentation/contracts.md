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
public record AppError(
    int code,
    String kind, // not null
    String messageEn, // not null
    String messagePl
) {}
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
    <td><code>400</code></td>
    <td><code>invalid-account-data</code></td>
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
    <tr>
    <th colspan="2">Leperechaun</th>
  </tr>
  <tr>
    <td><code>403</code></td>
    <td><code>user-forbidden</code></td>
  </tr>
  <tr>
    <td><code>404</code></td>
    <td><code>resource-not-found-exception</code></td>
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

~~Invalid pagination request (negative `page`, size `smaller` than 1, `size` bigger than 100) SHOULD return a `422` error with the `schema-mismatch` kind.~~ TODO: Confirm this behavior.

## Endpoints route

Every service MUST implement endpoint for listing all `/ext/` endpoints. This endpoint SHOULD return a list of all available endpoints in the service. The response MUST be a JSON object with the following schema:

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Endpoints API",
  "description": "List of all available endpoints in the service.",
  "type": "array",
  "readOnly": true,
  "properties": {
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "ALL",
        "OPTIONS",
        "HEAD",
        "SEARCH"
      ],
      "description": "HTTP method"
    },
    "path": {
      "type": "string",
      "description": "Path to resource",
      "example": "/ext/v1/vehicles"
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "enum": ["guest", "passenger", "driver", "admin", "inspector"],
      "description": "Roles required to access the endpoint",
      "example": ["admin", "inspector"]
    }
  },
  "required": ["method", "path"]
}
```

Which translates to the following types in the languages used in the project:

```TypeScript
type Endpoint = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "ALL" | "OPTIONS" | "HEAD" | "SEARCH";
  path: string;
  roles: ("guest" | "passenger" | "driver" | "admin" | "inspector")[];
};
```

```Java
public record Endpoint(
    String method, // not null
    String path, // not null
    List<String> roles
) {}
```

Example response:

```jsonc
[
  {
    "method": "GET",
    "path": "/ext/v1/vehicles",
    "roles": ["admin", "inspector"]
  },
  {
    "method": "POST",
    "path": "/ext/v1/vehicles",
    "roles": ["admin"]
  }
]
```

## Headers

The well-known headers of the system are:

- `user-agent` - HTTP standard, SHOULD be the name of the service, followed by its semantic version, e.g. `Jobberknoll/0.1.0`, `Phoenix/1.2.3`
- `jp-user-id` - custom header, MUST be a UUIDv7 of the account, or [nil UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Nil_UUID) (for unauthenticated users)
- `jp-user-role` - custom header, MUST be one of the following values: `guest` (for unauthenticated users), `passenger`, `driver`, `admin`, `inspector`
- `jp-request-id` - custom header, SHOULD be a random UUIDv7 generated by Phoenix representing the [external request ID](https://microservices.io/patterns/observability/distributed-tracing.html), if it is missing, the consumer SHOULD generate a new one themselves

HTTP headers are case-insensitive, for maximum compatibility, services MUST expect headers in any case and SHOULD send headers in lowercase.

### Guidelines for Phoenix

Phoenix SHOULD set the `user-agent` header to `Phoenix/1.0.0` (or other version) for any outgoing request.

Phoenix MUST set the `jp-user-id` header to the UUIDv7 of the account, or nil UUID if the user is not authenticated. The authentication information of the user SHOULD be obtained from the Feather sidecar.

Phoenix MUST set the `jp-user-role` header to the role of the user, or `guest` if the user is not authenticated. The authentication information of the user SHOULD be obtained from the Feather sidecar.

Phoenix SHOULD set the `jp-request-id` header to a random UUIDv7 for any request to the system.

Phoenix MUST discard well-known headers from the incoming requests (from outside the system) for security reasons. This behavior SHOULD be validated in the integration tests.

### Guidelines for other services

Other services MUST accept well-known headers on all incoming requests and SHOULD validate them.

Other services SHOULD discard well-known headers on all outgoing requests to the outside of the system for security reasons.

Other services SHOULD set the `user-agent` header to the name of the service, followed by its semantic version, e.g. `Jobberknoll/0.1.0`, `Clabbert/1.2.3` for any outgoing internal requests.

If the `jp-request-id` header is missing, the service SHOULD generate a new one themselves and pass it along to any outgoing internal requests. This is to support requests, which are not initiated by Phoenix or other services (e.g. testing, debugging, OpenAPI). The `jp-request-id` header is to be expected on both internal (`/int`) and external (`/ext`) incoming requests. The request ID SHOULD be included in all service logs. The request ID MAY be abbreviated in the logs, to the last N characters. This header SHOULD be expected on all incoming requests to both internal (`/int`) and external (`/ext`) endpoints.

The `jp-user-id` header SHOULD be required on all incoming requests to external (`/ext`) endpoints and MAY be present on incoming requests to internal (`/int`) endpoints. The `jp-user-id` header SHOULD be passed along to other services without any modifications. The service SHOULD include the `jp-user-id` header in all outgoing requests to external (`/ext`) endpoints. The `jp-user-id` header MAY be included in outgoing requests to internal (`/int`) endpoints. The `jp-user-id` header's value SHOULD be validated in each service.

The `jp-user-role` header SHOULD be required on all incoming requests to external (`/ext`) endpoints and MAY be present on incoming requests to internal (`/int`) endpoints. The `jp-user-role` header SHOULD be passed along to other services without any modifications. The service SHOULD include the `jp-user-role` header in all outgoing requests to external (`/ext`) endpoints. The `jp-user-role` header MAY be included in outgoing requests to internal (`/int`) endpoints. The use cases for `member` SHOULD accept all of `passenger`, `driver`, `admin` and `inspector`. The `jp-user-role` header's value SHOULD be validated in each service.

The Feather sidecar SHOULD NOT require the `jp-user-id` and `jp-user-role` headers to be present in any the incoming requests. It SHOULD accept the `user-agent` and `jp-request-id` headers and use them for logging purposes. It SHOULD NOT set the `jp-user-id` and `jp-user-role` headers in any outgoing requests, should set the `user-agent` to `Feather/1.0.0` (or any other version) and SHOULD pass the `jp-request-id` header along.

## Environment variables

The `SERVER_PORT` environment variable SHOULD be supported by all services. The default value for the port SHOULD be defined by the service itself. The service SHOULD listen on the configured port.
