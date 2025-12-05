package com.observability.collector.exception

/**
 * Thrown when an entity is not found.
 */
class NotFoundException(message: String) : RuntimeException(message)
