package com.observability.collector.repository.meta

import com.observability.collector.model.Alert
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface AlertsRepository : MongoRepository<Alert, String>
