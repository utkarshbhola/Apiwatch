package com.observability.collector.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.mongodb.MongoDatabaseFactory
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory

@Configuration
class MongoConfig(
    @Value("\${MONGO_URI_LOGS}") private val logsUri: String,
    @Value("\${MONGO_URI_MAIN}") private val metaUri: String
) {

    @Primary
    @Bean
    fun metaDbFactory(): MongoDatabaseFactory =
        SimpleMongoClientDatabaseFactory(metaUri)

    @Primary
    @Bean
    fun metaMongoTemplate(): MongoTemplate =
        MongoTemplate(metaDbFactory())

    @Bean
    fun logsDbFactory(): MongoDatabaseFactory =
        SimpleMongoClientDatabaseFactory(logsUri)

    @Bean
    fun logsMongoTemplate(): MongoTemplate =
        MongoTemplate(logsDbFactory())
}
