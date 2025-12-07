package com.observability.collector.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.MongoDatabaseFactory
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

@Configuration
@EnableMongoRepositories(
    basePackages = ["com.observability.collector.repository.logs"],
    mongoTemplateRef = "logsMongoTemplate"
)
class MongoLogsConfig(
    @Value("\${MONGO_URI_LOGS}") private val logsUri: String
) {

    @Bean(name = ["logsDbFactory"])
    fun logsDbFactory(): MongoDatabaseFactory =
        SimpleMongoClientDatabaseFactory(logsUri)

    @Bean(name = ["logsMongoTemplate"])
    fun logsMongoTemplate(): MongoTemplate =
        MongoTemplate(logsDbFactory())
}
