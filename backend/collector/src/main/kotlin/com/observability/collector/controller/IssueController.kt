package com.observability.collector.controller

import com.observability.collector.model.Issue
import com.observability.collector.service.impl.IssueService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/issue")
class IssueController(
    private val service: IssueService
) {

    @GetMapping
    fun getIssues(): List<Issue> = service.getAll()

    @PutMapping("/{id}/resolve")
    fun resolve(@PathVariable id: String): Issue = service.resolveIssue(id)
}
