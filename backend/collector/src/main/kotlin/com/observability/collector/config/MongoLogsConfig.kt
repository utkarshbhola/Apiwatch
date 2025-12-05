package com.observability.collector.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@Configuration
@EnableMongoRepositories(
    basePackages = ["com.observability.collector.repository.logs"],
    mongoTemplateRef = "logsMongoTemplate"
)
class MongoLogsConfig
