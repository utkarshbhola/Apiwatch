package com.apiwatch.client.sender

import com.apiwatch.client.model.ApiLog
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.web.client.RestTemplate

object LogSender {

    private val restTemplate = RestTemplate()

    fun send(log: ApiLog, collectorUrl: String) {
        try {
            val headers = HttpHeaders()
            headers.contentType = MediaType.APPLICATION_JSON
            val entity = HttpEntity(log, headers)

            restTemplate.postForObject(collectorUrl, entity, String::class.java)
        } catch (e: Exception) {
            println("ApiWatch Logging Error: ${e.message}")
        }
    }
}
