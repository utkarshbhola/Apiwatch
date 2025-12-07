APIWATCH — API Observability & Monitoring Platform

📄 Official Documentation: https://docs.google.com/document/d/1PFIMDdcGAzySj004vL7AsaPKSBvYsu2b6m2TbfTCfPU/edit?tab=t.0

🚀 Overview

APIWATCH is a distributed API monitoring platform that tracks latency, errors, rate-limit hits, and system-wide API behavior across microservices.
It includes a tracking client, a central collector, dual MongoDB setup, concurrency-safe issue resolution, and a Next.js dashboard.

🏛 Architecture



Components

API Tracking Client (Spring Boot + Kotlin) — Interceptor that captures API metrics, applies rate limiter, and sends logs to Collector.

Test Microservice — Simulates real traffic (success/slow/error endpoints) for validation.

Collector Service (Spring Boot) — Receives logs, stores them in dual databases, generates alerts, exposes REST APIs.

Dashboard (Next.js) — Log explorer, alerts viewer, analytics UI.

High-Level Flow

Microservice receives request

Tracking Interceptor logs metadata + rate-limit hit

Logs sent to Collector

Collector writes to logsDB + metaDB

Dashboard fetches aggregated insights

🗄 Database Schemas

(From pages 4–7, 5–7 in PDF 

API observability and monitorin…

)

Dual MongoDB Setup
Database	Purpose
logsDB	High-volume API logs (write-heavy).
metaDB	Users, alerts, issues (consistency-critical).
Schemas
logsDB — logs collection

service

endpoint

method

status

latency

timestamp

metaDB

users

username

passwordHash

role

alerts

type

payload/data

createdAt

issues

type

serviceName

endpoint

description

resolved (bool)

@Version (optimistic locking)

createdAt

🧠 Key Design Decisions

(From pages 7–9 in PDF 

API observability and monitorin…

)

MongoDB over SQL

Handles semi-structured log data

High write throughput

Natural JSON document format

Dual Database Architecture

Prevents heavy log writes from affecting metadata operations

Ensures dashboard & auth remain fast under load

Optimistic Locking for Issues

Prevents race conditions

Guarantees an issue resolves exactly once

JWT Authentication

Stateless, scalable, easy to integrate with Next.js

REST for Now (gRPC planned)

Lower complexity

Simpler integration between Spring Boot + JS

🗂 How Dual MongoDB Setup Works

(From page 5 of PDF 

API observability and monitorin…

)

logsDB receives all API logs — this DB is optimized for massive write throughput.

metaDB stores users, alerts, issues — consistency and concurrency control matter here.

Separation ensures:

Log spikes don’t slow down metadata reads

Issue resolution and dashboard rendering stay reliable

TTL indexes can be applied safely to logs without affecting critical data

⏱ How the Rate Limiter Works

(From pages 9–11 of PDF 

API observability and monitorin…

)

Model: Fixed-Window Counter

Inside each microservice:

Each request increments an in-memory counter.

Counter resets every 1 second.

Requests are never blocked.

When the limit is exceeded, a rate-limit-hit event is logged.

Interceptor Flow

Request arrives → rateLimiter.hit()

If threshold exceeded → log contains "rate-limit-hit": true

Collector persists this as an alert

Why this design?

Zero added latency

Works safely inside live microservices

Detects spikes without impacting traffic

Enables alerting + dashboard charts for traffic anomalies
