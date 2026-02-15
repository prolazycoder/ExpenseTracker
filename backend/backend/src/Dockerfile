# Use official OpenJDK image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy jar file
COPY target/*.jar app.jar

# Expose port (Render uses 8080 usually)
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
