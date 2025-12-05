package com.example.testservice.service

import com.example.testservice.dto.LogEntryDto
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class LogSenderService(
    private val restTemplate: RestTemplate,
    @Value("\${collector.url}") private val collectorUrl: String
) {
    private val logger = LoggerFactory.getLogger(LogSenderService::class.java)

    fun send(log: LogEntryDto) {
        try {
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_JSON
            val request = HttpEntity(log, headers)
            val res = restTemplate.postForEntity(collectorUrl, request, String::class.java)
            logger.info("Sent log to collector: status={} body={}", res.statusCode, res.body)
        } catch (ex: Exception) {
            logger.error("Failed to send log to collector: ${ex.message}", ex)
        }
    }
}
