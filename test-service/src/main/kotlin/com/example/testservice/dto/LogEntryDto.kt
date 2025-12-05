package com.example.testservice.dto

import java.time.Instant

data class LogEntryDto(
    val service: String,
    val endpoint: String,
    val method: String,
    val status: Int,
    val latency: Long,
    val timestamp: Instant
)
