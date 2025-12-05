package com.apiwatch.client.model

data class ApiLog(
    val service: String,
    val endpoint: String,
    val method: String,
    val requestSize: Long,
    val responseSize: Long,
    val statusCode: Int,
    val latency: Long,
    val timestamp: Long
)
