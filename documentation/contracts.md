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

The error statuses, such as `500 Internal Server Error` should not be present in the OpenAPI documentation, since there is never a need to explicitly return such status from the controller. The `5XX` codes, as well as actual network errors, can generally be encountered when calling any endpoint. The consumer should treat them both as a sign of the service being unhealthy.
