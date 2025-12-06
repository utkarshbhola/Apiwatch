package com.observability.collector.repository.meta

import com.observability.collector.model.Issue
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface IssueRepository : MongoRepository<Issue, String> {

    // 🔥 Correct method declaration
    fun findByServiceNameAndEndpointAndResolvedFalse(
        serviceName: String,
        endpoint: String
    ): Issue?
}
