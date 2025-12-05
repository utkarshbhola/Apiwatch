package com.observability.collector.model

import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document

/**
 * Issue entity with optimistic locking support.
 */
@Document(collection = "issues")
data class Issue(
    @Id
    var id: String? = null,
    val endpoint: String,
    val service: String,
    var resolved: Boolean = false,
    @Version
    var version: Long? = null
)
