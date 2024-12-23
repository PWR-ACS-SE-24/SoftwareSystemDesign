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

## Endpoints route

TODO

## Error schema

TODO

## Headers

TODO
