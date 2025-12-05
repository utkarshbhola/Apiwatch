package com.observability.collector.controller

import com.observability.collector.dto.ApiResponse
import com.observability.collector.dto.LogEntryDto
import com.observability.collector.model.LogEntry
import com.observability.collector.service.CollectorService
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

/**
 * Main REST API for ingesting logs, viewing alerts and stats.
 */
@RestController
class CollectorController(
    private val collectorService: CollectorService
) {

    @PostMapping("/log")
    fun ingestLog(@Valid @RequestBody dto: LogEntryDto): ResponseEntity<ApiResponse> {
        val entry = LogEntry(
            service = dto.service,
            endpoint = dto.endpoint,
            method = dto.method,
            status = dto.status,
            latency = dto.latency,
            timestamp = dto.timestamp
        )
        val saved = collectorService.ingestLog(entry)
        return ResponseEntity.ok(ApiResponse("log saved", saved))
    }

    @PostMapping("/rate-limit")
    fun rateLimit(@RequestBody body: Map<String, Any>): ResponseEntity<ApiResponse> {
        collectorService.ingestRateLimitEvent(body)
        return ResponseEntity.ok(ApiResponse("rate-limit recorded"))
    }

    @GetMapping("/logs")
    fun getLogs(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(required = false) service: String?,
        @RequestParam(required = false) status: Int?,
        @RequestParam(required = false) slowOnly: Boolean?
    ): ResponseEntity<Any> {
        val pageable: Pageable = PageRequest.of(page, size)
        val logs: Page<LogEntry> = collectorService.getLogs(pageable, service, status, slowOnly)
        return ResponseEntity.ok(logs)
    }

    @GetMapping("/alerts")
    fun getAlerts(): ResponseEntity<Any> = ResponseEntity.ok(collectorService.getAlerts())

    @GetMapping("/stats")
    fun getStats(): ResponseEntity<Any> = ResponseEntity.ok(collectorService.getStats())

    @PutMapping("/issue/{id}/resolve")
    fun resolveIssue(@PathVariable id: String): ResponseEntity<ApiResponse> {
        val resolved = collectorService.resolveIssue(id)
        return ResponseEntity.ok(ApiResponse("issue resolved", resolved))
    }

    // Simple SSE endpoint for new logs
    @GetMapping("/stream/logs")
    fun streamLogs(): SseEmitter {
        // allow public access for local dev; production may require auth
        return (collectorService as? com.observability.collector.service.impl.CollectorServiceImpl)
            ?.createEmitter() ?: SseEmitter()
    }
}
