package com.apiwatch.client.rateLimiter

class RateLimiter(private val limit: Int) {

    @Volatile
    private var lastReset = System.currentTimeMillis()

    @Volatile
    private var count = 0

    fun hit(): Boolean {
        val now = System.currentTimeMillis()

        if (now - lastReset >= 1000) {
            lastReset = now
            count = 0
        }

        count++

        return count <= limit
    }
}
