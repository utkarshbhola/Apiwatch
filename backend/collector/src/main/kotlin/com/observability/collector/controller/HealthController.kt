package com.observability.collector.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthController {
    @GetMapping("/")
    fun root() = ResponseEntity.ok(mapOf("status" to "ok"))

    @GetMapping("/actuator/health")
    fun health() = ResponseEntity.ok(mapOf("status" to "UP"))
}
