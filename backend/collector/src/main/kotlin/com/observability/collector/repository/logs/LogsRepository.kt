package com.observability.collector.repository.logs

import com.observability.collector.model.LogEntry
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface LogsRepository : MongoRepository<LogEntry, String>
