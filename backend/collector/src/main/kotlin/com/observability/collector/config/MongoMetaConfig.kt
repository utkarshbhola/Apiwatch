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
    basePackages = ["com.observability.collector.repository.meta"],
    mongoTemplateRef = "metaMongoTemplate"
)
class MongoMetaConfig(
    @Value("\${MONGO_URI_MAIN}") private val metaUri: String
) {

    @Bean(name = ["metaDbFactory"])
    fun metaDbFactory(): MongoDatabaseFactory =
        SimpleMongoClientDatabaseFactory(metaUri)

    @Bean(name = ["metaMongoTemplate"])
    fun metaMongoTemplate(): MongoTemplate =
        MongoTemplate(metaDbFactory())
}
