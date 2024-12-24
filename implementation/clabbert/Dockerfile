FROM openjdk:21-jdk AS build
RUN microdnf install findutils

COPY build.gradle settings.gradle gradlew /
COPY gradle /gradle
RUN ./gradlew clean assemble --no-daemon > /dev/null 2>&1 || true

COPY src /src
RUN ./gradlew clean assemble --no-daemon

FROM openjdk:21-jdk
COPY --from=build /build/libs/clabbert-0.0.1.jar .
CMD ["java","-jar","clabbert-0.0.1.jar"]

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --spider http://localhost:8080/api/v1/health || exit 1