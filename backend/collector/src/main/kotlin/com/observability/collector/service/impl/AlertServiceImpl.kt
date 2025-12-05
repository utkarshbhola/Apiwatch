package com.observability.collector.service.impl

import com.observability.collector.model.Alert
import com.observability.collector.repository.meta.AlertsRepository
import com.observability.collector.service.AlertService
import org.springframework.stereotype.Service

@Service
class AlertServiceImpl(
    private val alertsRepository: AlertsRepository
) : AlertService {
    override fun createAlert(alert: Alert): Alert = alertsRepository.save(alert)
    override fun getAlerts(): List<Alert> = alertsRepository.findAll()
}
