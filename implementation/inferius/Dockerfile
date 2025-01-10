FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk
WORKDIR /app

COPY --from=build /app/target/inferius-0.0.1-SNAPSHOT.jar inferius.jar

CMD ["java", "-jar", "inferius.jar"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget --spider http://localhost:8080/int/v1/health || exit 1
