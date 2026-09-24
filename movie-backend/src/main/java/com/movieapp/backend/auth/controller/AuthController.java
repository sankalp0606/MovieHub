package com.movieapp.backend.auth.controller;

import com.movieapp.backend.auth.AuthService;
import com.movieapp.backend.auth.dto.LoginRequest;
import com.movieapp.backend.auth.dto.LoginResponse;
import com.movieapp.backend.auth.dto.SignupRequest;
import com.movieapp.backend.auth.dto.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(
            @RequestBody SignupRequest request) {

        return ResponseEntity.ok(
                authService.signup(request)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}