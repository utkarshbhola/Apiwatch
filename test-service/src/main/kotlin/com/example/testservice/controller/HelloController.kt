package com.example.testservice.controller

import com.example.testservice.dto.LogEntryDto
import com.example.testservice.service.LogSenderService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import kotlin.random.Random
import org.slf4j.LoggerFactory

@RestController
@RequestMapping("/")
class HelloController(private val sender: LogSenderService) {

    private val logger = LoggerFactory.getLogger(HelloController::class.java)

    @GetMapping("/hello")
    fun hello(): String {
        val start = System.currentTimeMillis()
        // simulate handling
        val latency = Random.nextLong(30, 150)
        Thread.sleep(latency)
        val dto = LogEntryDto(
            service = "test-service",
            endpoint = "/hello",
            method = "GET",
            status = 200,
            latency = latency,
            timestamp = Instant.now()
        )
        sender.send(dto)
        logger.info("Handled /hello, sent log")
        return "Hello from test-service"
    }

    @GetMapping("/slow")
    fun slow(): String {
        val start = System.currentTimeMillis()
        val latency = 900L
        Thread.sleep(latency)
        val dto = LogEntryDto(
            service = "test-service",
            endpoint = "/slow",
            method = "GET",
            status = 200,
            latency = latency,
            timestamp = Instant.now()
        )
        sender.send(dto)
        logger.info("Handled /slow, sent slow log")
        return "slow endpoint"
    }

    @GetMapping("/error")
    fun error(): String {
        val latency = 50L
        val dto = LogEntryDto(
            service = "test-service",
            endpoint = "/error",
            method = "GET",
            status = 500,
            latency = latency,
            timestamp = Instant.now()
        )
        sender.send(dto)
        logger.info("Handled /error, sent error log")
        // optionally throw — comment out if you prefer not to crash
        // throw RuntimeException("Intentional error for testing")
        return "error endpoint (logged 500)"
    }
}
