FROM gradle:8.12.0-jdk21 AS build


WORKDIR /clabbert/
COPY build.gradle settings.gradle /clabbert/
COPY src/ /clabbert/src/

RUN --mount=type=cache,target=/root/.gradle gradle assemble --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runtime
RUN apk add --no-cache curl

COPY --from=build /clabbert/build/libs/clabbert-0.0.1.jar .
CMD ["java","-jar","clabbert-0.0.1.jar"]

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --spider http://localhost:8080/api/v1/health || exit 1