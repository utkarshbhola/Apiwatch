package com.observability.collector.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.MongoDatabaseFactory
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory
import org.springframework.context.annotation.Primary
@Primary
@Configuration
class MongoConfig {

    @Bean
    fun logsDbFactory(): MongoDatabaseFactory =
        SimpleMongoClientDatabaseFactory("mongodb://localhost:27017/logsDB")

    @Bean
    fun logsMongoTemplate(): MongoTemplate =
        MongoTemplate(logsDbFactory())

    @Bean
    fun metaDbFactory(): MongoDatabaseFactory =
        SimpleMongoClientDatabaseFactory("mongodb://localhost:27017/metaDB")

    @Bean
    fun metaMongoTemplate(): MongoTemplate =
        MongoTemplate(metaDbFactory())
}
