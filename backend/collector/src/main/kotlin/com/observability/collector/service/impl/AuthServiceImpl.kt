package com.observability.collector.service.impl

import com.observability.collector.dto.LoginRequest
import com.observability.collector.exception.NotFoundException
import com.observability.collector.model.User
import com.observability.collector.repository.meta.UserRepository
import com.observability.collector.security.JwtUtil
import com.observability.collector.service.AuthService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthServiceImpl(
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil
) : AuthService {

    private val encoder = BCryptPasswordEncoder()

    override fun signup(username: String, password: String): User {
        if (userRepository.findByUsername(username).isPresent)
            throw IllegalArgumentException("Username already taken")

        val user = User(
            username = username,
            passwordHash = encoder.encode(password)
        )

        return userRepository.save(user)
    }

    override fun login(req: LoginRequest): String {
        val user = userRepository.findByUsername(req.username)
            .orElseThrow { NotFoundException("User not found") }

        if (!encoder.matches(req.password, user.passwordHash))
            throw IllegalArgumentException("Invalid credentials")

        return jwtUtil.generateToken(user.username)
    }
}
