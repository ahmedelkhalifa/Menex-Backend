# Stage 1: Build the application using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# This builds your .jar file and skips tests to make it faster
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy the built .jar from Stage 1
COPY --from=build /app/target/Menex-0.0.1-SNAPSHOT.jar app.jar

# Create a folder inside the container for our restaurant images
RUN mkdir -p /app/uploads/restaurants

# Expose port 8080
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]