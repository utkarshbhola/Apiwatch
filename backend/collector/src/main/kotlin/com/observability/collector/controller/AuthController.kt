package com.observability.collector.controller

import com.observability.collector.dto.ApiResponse
import com.observability.collector.dto.LoginRequest
import com.observability.collector.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/signup")
    fun signup(@RequestBody req: LoginRequest): ResponseEntity<ApiResponse> {
        val user = authService.signup(req.username, req.password)
        return ResponseEntity.ok(ApiResponse("user created", user))
    }

    @PostMapping("/login")
    fun login(@RequestBody req: LoginRequest): ResponseEntity<ApiResponse> {
        val token = authService.login(req)
        return ResponseEntity.ok(ApiResponse("success", mapOf("token" to token)))
    }
}
