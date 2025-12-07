package com.observability.collector.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.mongodb.MongoDatabaseFactory
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories

// =====================
// META DB (users, alerts, issues)
// =====================
@Configuration
@EnableMongoRepositories(
    basePackages = ["com.observability.collector.repository.meta"],
    mongoTemplateRef = "metaMongoTemplate"
)
class MetaMongoConfig(
    @Value("\${MONGO_URI_MAIN}") private val metaUri: String
) {

    @Primary
    @Bean(name = ["metaDbFactory"])
    fun metaDbFactory(): MongoDatabaseFactory =
        SimpleMongoClientDatabaseFactory(metaUri)

    @Primary
    @Bean(name = ["metaMongoTemplate"])
    fun metaMongoTemplate(): MongoTemplate =
        MongoTemplate(metaDbFactory())
}


// =====================
// LOGS DB (api_logs)
// =====================
@Configuration
@EnableMongoRepositories(
    basePackages = ["com.observability.collector.repository.logs"],
    mongoTemplateRef = "logsMongoTemplate"
)
class LogsMongoConfig(
    @Value("\${MONGO_URI_LOGS}") private val logsUri: String
) {

    @Bean(name = ["logsDbFactory"])
    fun logsDbFactory(): MongoDatabaseFactory =
        SimpleMongoClientDatabaseFactory(logsUri)

    @Bean(name = ["logsMongoTemplate"])
    fun logsMongoTemplate(): MongoTemplate =
        MongoTemplate(logsDbFactory())
}
