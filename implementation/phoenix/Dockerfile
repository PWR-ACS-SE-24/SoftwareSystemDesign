FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/phoenix-0.0.1-SNAPSHOT.jar phoenix.jar

CMD ["java", "-jar", "phoenix.jar"]

EXPOSE 8080