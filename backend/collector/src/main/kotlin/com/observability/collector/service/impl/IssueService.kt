package com.observability.collector.service.impl

import com.observability.collector.exception.NotFoundException
import com.observability.collector.model.Issue
import com.observability.collector.repository.meta.IssueRepository
import org.springframework.dao.OptimisticLockingFailureException
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Service
class IssueService(
    private val issueRepository: IssueRepository
) {

    fun getAll(): List<Issue> = issueRepository.findAll()

    fun resolveIssue(id: String): Issue {
        val issue = issueRepository.findById(id)
            .orElseThrow { NotFoundException("Issue $id not found") }

        if (issue.resolved) {
            throw OptimisticLockingFailureException("Issue is already resolved")
        }

        issue.resolved = true

        return issueRepository.save(issue)
    }

    // 🔥 Add this — will be called from LogService
    fun createIssueIfNeeded(
        serviceName: String,
        endpoint: String,
        status: Int
    ) {
        // Only create issues for 500 errors
        if (status != 500) return

        // Check if unresolved issue already exists
        val existing = issueRepository
            .findByServiceNameAndEndpointAndResolvedFalse(serviceName, endpoint)

        if (existing != null) return  // Already have open issue → do NOT create new

        // Create new issue
        val issue = Issue(
            type = "broken-api",
            serviceName = serviceName,
            endpoint = endpoint,
            description = "500 response detected",
            resolved = false,
            version = 0
        )

        issueRepository.save(issue)
    }
}

