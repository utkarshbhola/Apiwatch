package com.observability.collector.service

import com.observability.collector.model.Alert

/**
 * Service responsible for creating and retrieving alerts.
 */
interface AlertService {
    fun createAlert(alert: Alert): Alert
    fun getAlerts(): List<Alert>
}
