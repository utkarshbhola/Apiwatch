package com.observability.collector.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Min
import java.time.Instant


/**
 * DTO used to ingest logs.
 */
data class LogEntryDto(
    @field:NotBlank
    val service: String,

    @field:NotBlank
    val endpoint: String,

    @field:NotBlank
    val method: String,

    @field:NotNull
    @field:Min(0)
    val status: Int,

    @field:NotNull
    @field:Min(0)
    val latency: Long,

    @field:NotNull
    val timestamp: Instant
)