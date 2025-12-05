package com.observability.collector.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Alert stored in meta DB (secondary).
 */
@Document(collection = "alerts")
data class Alert(
    @Id
    var id: String? = null,
    val type: String,
    val data: Map<String, Any>,
    val createdAt: Long = System.currentTimeMillis()
)
