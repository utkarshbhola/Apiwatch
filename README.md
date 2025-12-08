# APIWATCH — API Observability & Monitoring Platform

A distributed API observability platform that tracks latency, failures, rate-limit events, and system behavior across microservices.
Built with Spring Boot + Kotlin, MongoDB, and a Next.js Dashboard.

Full Documentation: https://docs.google.com/document/d/1PFIMDdcGAzySj004vL7AsaPKSBvYsu2b6m2TbfTCfPU/edit
Deployed Collector Dashboard: https://apiwatch-u8jx.vercel.app/

## Architecture Overview

APIWATCH has four core components:

### Tracking Interceptor (Spring Boot + Kotlin)
Intercepts every request, captures metadata, applies rate limiter, and sends logs.

### Collector Service (Spring Boot + kotlin)
Ingests logs, writes to dual MongoDB, generates alerts, and exposes REST APIs.

### Dashboard (Next.js)
logs viewer, alerts dashboard, issues page, and analytics.

### Test Microservice(Spring Boot + kotlin)
Generates slow/error/healthy endpoints to validate tracking.
<img width="2746" height="873" alt="architecture overview" src="https://github.com/user-attachments/assets/cf36ca16-8ad6-49a8-a8b3-5a8e04f40eb3" />
## High-Level Flow

→ logsDB (write-heavy logs)  
→ metaDB (users, alerts, issues)  
→ Dashboard fetches insights
<img width="3335" height="1340" alt="Untitled diagram-2025-12-05-150031" src="https://github.com/user-attachments/assets/4bb8674f-2e45-4d1a-a030-9605fc8b65d0" />

## Database Schemas (Simplified)
### logsDB (High-volume log storage)
{
  "service": "string",
  "endpoint": "string",
  "method": "GET/POST",
  "status": 200,
  "latency": 123,
  "timestamp": "ISO"
}

### metaDB 
#### users
{ "username": "admin", "passwordHash": "..." }

#### alerts
{ "type": "rate-limit-hit", "data": {...}, "createdAt": "ISO" }

#### issues (Optimistic Locking)
{
  "type": "broken-api",
  "serviceName": "user-service",
  "endpoint": "/login",
  "description": "500 responses",
  "resolved": false,
  "version": 1,
  "createdAt": "ISO"
}
<img width="1138" height="469" alt="Untitled diagram-2025-12-05-150150" src="https://github.com/user-attachments/assets/3659c1f4-735d-4c19-90b1-58ce9f9e487b" />


## Key Design Decisions
### MongoDB over SQL

Handles semi-structured log data

Designed for high write throughput

Natural JSON format reduces mapping overhead

### Dual Database Architecture

logsDB → heavy writes

metaDB → critical metadata (users, issues, alerts)

Ensures spikes in log traffic never slow down the dashboard or auth

### Optimistic Locking for Issue Resolution

Guarantees an issue is resolved exactly once

Prevents concurrency conflicts between multiple dashboard users

### JWT Authentication

Stateless

Easy to integrate with Next.js dashboard

Scales well horizontally

## How the Dual MongoDB Setup Works
### Database	Purpose
#### logsDB	
      High-volume logs, optimized for writes, supports TTL cleanup
#### metaDB	
      Users, alerts, issues — consistency-critical

### Why two DBs?

Log spikes never affect metadata operations

Dashboard stays responsive even under heavy load

TTL can expire logs without touching critical data

## How the Rate Limiter Works
### Model: Fixed-Window Counter (1-second window)

Inside each microservice:

Request arrives

Counter increments in memory

If threshold crossed → rate-limit-hit = true

Request still proceeds (non-blocking)

Collector receives this signal and creates an alert

### Why this design?

Adds zero latency to APIs

Useful for detecting traffic spikes

Safe to run inside production microservices

Easy to visualize in dashboard analytics

## Tech Stack

Spring Boot + Kotlin — microservices, interceptor, collector

MongoDB — dual DB architecture

Next.js + TypeScript — dashboard

JWT Auth — secure access

Docker & Render - backend deployment
Vercel - Frontend deployment

## Running the Project Locally

#### Clone the repository:

```bash
git clone https://github.com/utkarshbhola/apiwatch.git
cd apiwatch
```
### Start the Collector Service (Spring Boot + Kotlin)

```bash
cd collector
./gradlew clean bootRun
```

The Collector will start on http://localhost:8080

It exposes:

/logs — ingest API logs

/alerts — fetch alerts

/issues — manage issues

### Start the Dashboard (Next.js)

```bash
cd dashboard
npm install
npm run dev
```

Dashboard runs on http://localhost:3000
### Run the Test Microservice
Simulates success / slow / error endpoints for testing:
```bash
cd test-microservice
./gradlew bootRun
```

### Configure Environment Variables

Inside dashboard/.env.local:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

For concurrency and performance test results (K6 + Grafana), see the full [documentation]([url](https://docs.google.com/document/d/1PFIMDdcGAzySj004vL7AsaPKSBvYsu2b6m2TbfTCfPU/edit)).

