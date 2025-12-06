package com.observability.collector.service

import com.observability.collector.dto.LoginRequest
import com.observability.collector.model.User

interface AuthService {
    fun signup(username: String, password: String): User
    fun login(req: LoginRequest): String   // returns JWT token
}
