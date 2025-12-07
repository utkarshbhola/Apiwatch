# ============================
# 1. Build Stage
# ============================
FROM gradle:8-jdk17 AS builder
WORKDIR /app

# Copy only the collector backend
COPY backend/collector /app/collector

# Build the jar
WORKDIR /app/collector
RUN gradle bootJar --no-daemon

# ============================
# 2. Run Stage
# ============================
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/collector/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
