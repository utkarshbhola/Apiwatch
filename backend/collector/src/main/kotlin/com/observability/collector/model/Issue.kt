package com.observability.collector.model
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant

/**
 * Issue entity with optimistic locking support.
 */
@Document("issues")
data class Issue(
    @Id
    var id: String = ObjectId().toHexString(),



    val type: String,            // "broken-api"
    val serviceName: String,     // matches Mongo
    val endpoint: String,
    val description: String,     // exists in Mongo
    var resolved: Boolean = false,

    @Version
    var version: Long? = null,   // REQUIRED for concurrency

    val createdAt: Instant? = Instant.now()
)

