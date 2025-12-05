package com.observability.collector.dto

/**
 * Generic API response wrapper.
 */
data class ApiResponse(val message: String, val data: Any? = null)
