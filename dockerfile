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

COPY --from=builder /app/collector/build/libs/*.jar app.jar

# Pick up Render's PORT
ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]
