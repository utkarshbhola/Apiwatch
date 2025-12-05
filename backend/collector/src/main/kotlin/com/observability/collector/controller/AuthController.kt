package com.observability.collector.controller

import com.observability.collector.dto.ApiResponse
import com.observability.collector.dto.LoginRequest
import com.observability.collector.security.JwtUtil
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/**
 * Simple auth controller providing /auth/login that returns a JWT.
 * In production replace with real user store.
 */
@RestController
@RequestMapping("/auth")
class AuthController(
    private val jwtUtil: JwtUtil,
    @Value("\${app.auth.username:admin}")
    private val configuredUser: String,
    @Value("\${app.auth.password:password123}")
    private val configuredPass: String
) {

    @PostMapping("/login")
    fun login(@Validated @RequestBody req: LoginRequest): ResponseEntity<ApiResponse> {
        if (req.username == configuredUser && req.password == configuredPass) {
            val token = jwtUtil.generateToken(req.username)
            return ResponseEntity.ok(ApiResponse("success", mapOf("token" to token)))
        }
        return ResponseEntity.status(401).body(ApiResponse("invalid credentials"))
    }
}
