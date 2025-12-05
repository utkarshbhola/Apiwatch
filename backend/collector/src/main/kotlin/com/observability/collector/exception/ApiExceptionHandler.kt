package com.observability.collector.exception

import com.observability.collector.dto.ApiResponse
import org.springframework.dao.OptimisticLockingFailureException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFound(ex: NotFoundException): ResponseEntity<ApiResponse> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse(message = ex.message ?: "Resource not found"))
    }

    @ExceptionHandler(OptimisticLockingFailureException::class)
    fun handleOptimisticLock(ex: OptimisticLockingFailureException): ResponseEntity<ApiResponse> {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(ApiResponse(message = "Conflict while updating resource. Please retry."))
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneric(ex: Exception): ResponseEntity<ApiResponse> {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse(message = ex.message ?: "Internal server error"))
    }
}
