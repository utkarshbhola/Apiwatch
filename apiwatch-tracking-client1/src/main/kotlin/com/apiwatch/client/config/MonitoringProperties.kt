package com.apiwatch.client.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "monitoring")
class MonitoringProperties {
    var service: String = "default-service"
    var limit: Int = 100
    var collectorUrl: String = "http://localhost:8080/api/logs"
}
