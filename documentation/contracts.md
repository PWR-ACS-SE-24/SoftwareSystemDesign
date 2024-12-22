# Contracts respected by all microservices

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

The endpoint should return a `200 OK` if the service is possibly healthy (`UP`, `UNKNOWN`), and a `503 Service Unavailable` if the service is unhealthy (`DOWN`, `OUT_OF_SERVICE`).
