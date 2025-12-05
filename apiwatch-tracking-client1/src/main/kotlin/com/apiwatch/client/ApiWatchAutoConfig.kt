package com.apiwatch.client

import com.apiwatch.client.config.MonitoringProperties
import com.apiwatch.client.interceptor.ApiTrackingInterceptor
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableConfigurationProperties(MonitoringProperties::class)
class ApiWatchAutoConfig : WebMvcConfigurer {

    @Bean
    @ConditionalOnMissingBean
    fun apiTrackingInterceptor(
        properties: MonitoringProperties
    ) = ApiTrackingInterceptor(properties)

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(apiTrackingInterceptor(MonitoringProperties()))
    }
}
