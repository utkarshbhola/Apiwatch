package com.observability.collector.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

@Document("users")
data class User(
    @Id val id: String? = null,
    val username: String,
    val passwordHash: String,
    val role: String = "USER",
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
)
