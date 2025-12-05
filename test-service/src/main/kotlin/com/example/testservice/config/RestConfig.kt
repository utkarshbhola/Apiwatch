package com.example.testservice.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.web.client.RestTemplate

@Configuration
class RestConfig {

    @Bean
    fun objectMapper(): ObjectMapper {
        val mapper = ObjectMapper()
        mapper.registerModule(JavaTimeModule())
        // leave default date settings so Instant -> ISO string
        return mapper
    }

    @Bean
    fun restTemplate(mapper: ObjectMapper): RestTemplate {
        val rest = RestTemplate()
        val converter = MappingJackson2HttpMessageConverter()
        converter.objectMapper = mapper
        // prefer jackson converter first
        rest.messageConverters.removeIf { it is MappingJackson2HttpMessageConverter }
        rest.messageConverters.add(0, converter)
        return rest
    }
}
