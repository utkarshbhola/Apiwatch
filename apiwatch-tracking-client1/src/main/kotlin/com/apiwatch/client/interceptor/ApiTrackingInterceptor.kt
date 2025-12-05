package com.apiwatch.client.interceptor

import com.apiwatch.client.config.MonitoringProperties
import com.apiwatch.client.model.ApiLog
import com.apiwatch.client.rateLimiter.RateLimiter
import com.apiwatch.client.sender.LogSender
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.servlet.HandlerInterceptor

class ApiTrackingInterceptor(
    private val properties: MonitoringProperties
) : HandlerInterceptor {

    private val rateLimiter = RateLimiter(properties.limit)

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        request.setAttribute("startTime", System.currentTimeMillis())
        return true
    }

    override fun afterCompletion(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
        ex: Exception?
    ) {
        val start = request.getAttribute("startTime") as Long
        val latency = System.currentTimeMillis() - start

        val log = ApiLog(
            service = properties.service,
            endpoint = request.requestURI,
            method = request.method,
            requestSize = request.contentLengthLong,
            responseSize = response.bufferSize.toLong(),
            statusCode = response.status,
            latency = latency,
            timestamp = System.currentTimeMillis()
        )

        // Rate Limit
        val allowed = rateLimiter.hit()
        if (!allowed) {
            println("RATE LIMIT HIT for service=${properties.service}")
        }

        // Send log
        LogSender.send(log, properties.collectorUrl)
    }
}
