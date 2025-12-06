package com.observability.collector.service.impl

import com.observability.collector.exception.NotFoundException
import com.observability.collector.model.Alert
import com.observability.collector.model.Issue
import com.observability.collector.model.LogEntry
import com.observability.collector.repository.logs.LogsRepository
import com.observability.collector.repository.meta.AlertsRepository
import com.observability.collector.repository.meta.IssueRepository
import com.observability.collector.service.CollectorService
import org.springframework.dao.OptimisticLockingFailureException
import org.springframework.data.domain.*
import org.springframework.stereotype.Service
import java.util.concurrent.CopyOnWriteArrayList
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.time.Instant

/**
 * Collector service implementation.
 * - saves logs to primary (LogsRepository)
 * - creates alerts in secondary (AlertsRepository) based on rules
 * - exposes basic stats and SSE stream for new logs
 */
@Service
class CollectorServiceImpl(
    private val logsRepository: LogsRepository,
    private val alertsRepository: AlertsRepository,
    private val issueRepository: IssueRepository
) : CollectorService {

    // In-memory list of SSE emitters for /stream/logs
    private val emitters = CopyOnWriteArrayList<SseEmitter>()

    override fun ingestLog(log: LogEntry): LogEntry {
        val saved = logsRepository.save(log)

        // SSE push
        pushToEmitters(saved)

        // Create alerts
        if (log.latency > 500) {
            val alert = Alert(type = "slow-api", data = mapOf(
                "service" to log.service,
                "endpoint" to log.endpoint,
                "latency" to log.latency,
                "timestamp" to log.timestamp
            ))
            alertsRepository.save(alert)
        }
        if (log.status >= 500) {
            val alert = Alert(type = "broken-api", data = mapOf(
                "service" to log.service,
                "endpoint" to log.endpoint,
                "status" to log.status,
                "timestamp" to log.timestamp
            ))
            alertsRepository.save(alert)
        }
        // 🔥 Create Issue when 500 errors occur
        if (log.status >= 500) {
            // Check if there is already an unresolved issue for this service + endpoint
            val existing = issueRepository.findByServiceNameAndEndpointAndResolvedFalse(
                log.service,
                log.endpoint
            )

            if (existing == null) {
                val issue = Issue(
                    type = "broken-api",
                    serviceName = log.service,
                    endpoint = log.endpoint,
                    description = "500 response detected",
                    resolved = false,
                    createdAt = Instant.now()
                )
                issueRepository.save(issue)
            }
        }

        return saved
    }

    override fun ingestRateLimitEvent(body: Map<String, Any>) {
        val alert = Alert(type = "rate-limit-hit", data = body)
        alertsRepository.save(alert)
    }

    override fun getLogs(pageable: Pageable, service: String?, status: Int?, slowOnly: Boolean?): Page<LogEntry> {
        // Very simple query composition using ExampleMatcher if filters provided
        val probe = LogEntry(
            id = null,
            service = service ?: "",
            endpoint = "",
            method = "",
            status = status ?: 0,
            latency = 0,
            timestamp = Instant.EPOCH   // ✅ FIX
        )

        // If no filters provided, just return repository.findAll(pageable)
        val needCustom = service != null || status != null || (slowOnly != null && slowOnly)

        if (!needCustom) {
            return logsRepository.findAll(pageable)
        }

        // Fetch all matching minimal via findAll and perform filtering in memory (simple approach)
        val all = logsRepository.findAll()
        val filtered = all.filter { le ->
            val byService = service?.let { le.service.equals(it, ignoreCase = true) } ?: true
            val byStatus = status?.let { le.status == it } ?: true
            val bySlow = slowOnly?.let { if (it) le.latency > 500 else true } ?: true
            byService && byStatus && bySlow
        }

        val start = pageable.pageNumber * pageable.pageSize
        val end = (start + pageable.pageSize).coerceAtMost(filtered.size)
        val content = if (start >= filtered.size) listOf<LogEntry>() else filtered.subList(start, end)
        return PageImpl(content, pageable, filtered.size.toLong())
    }

    override fun getAlerts(): List<com.observability.collector.model.Alert> = alertsRepository.findAll()

    override fun getStats(): Map<String, Long> {
        val alerts = alertsRepository.findAll()
        val slow = alerts.count { it.type == "slow-api" }.toLong()
        val broken = alerts.count { it.type == "broken-api" }.toLong()
        val rate = alerts.count { it.type == "rate-limit-hit" }.toLong()
        return mapOf("slow" to slow, "broken" to broken, "rate" to rate)
    }

    override fun resolveIssue(id: String): Issue {
        val issue = issueRepository.findById(id).orElseThrow { NotFoundException("Issue $id not found") }
        issue.resolved = true
        try {
            return issueRepository.save(issue)
        } catch (ex: OptimisticLockingFailureException) {
            throw ex
        }
    }

    // SSE helpers
    fun createEmitter(): SseEmitter {
        val emitter = SseEmitter(Long.MAX_VALUE)
        emitter.onCompletion { emitters.remove(emitter) }
        emitter.onTimeout { emitters.remove(emitter) }
        emitters.add(emitter)
        return emitter
    }

    private fun pushToEmitters(log: LogEntry) {
        val dead = mutableListOf<SseEmitter>()
        emitters.forEach { emitter ->
            try {
                emitter.send(SseEmitter.event().name("log").data(log))
            } catch (ex: Exception) {
                dead.add(emitter)
            }
        }
        emitters.removeAll(dead)
    }
}
