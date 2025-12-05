package com.observability.collector.service

import com.observability.collector.model.Issue
import com.observability.collector.model.LogEntry
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

/**
 * Collector service interface for ingesting logs, rate-limit events and fetching data.
 */
interface CollectorService {
    fun ingestLog(log: LogEntry): LogEntry
    fun ingestRateLimitEvent(body: Map<String, Any>)
    fun getLogs(pageable: Pageable, service: String?, status: Int?, slowOnly: Boolean?): Page<LogEntry>
    fun getAlerts(): List<com.observability.collector.model.Alert>
    fun getStats(): Map<String, Long>
    fun resolveIssue(id: String): Issue
}
