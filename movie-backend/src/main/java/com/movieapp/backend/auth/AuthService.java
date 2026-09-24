package com.movieapp.backend.auth;

import com.movieapp.backend.auth.dto.LoginRequest;
import com.movieapp.backend.auth.dto.LoginResponse;
import com.movieapp.backend.auth.dto.SignupRequest;
import com.movieapp.backend.auth.dto.UserResponse;
import com.movieapp.backend.auth.security.JwtService;
import com.movieapp.backend.entity.User;
import com.movieapp.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // SIGNUP
    // =========================

    public UserResponse signup(SignupRequest request) {

        // Validate name
        if (request.getName() == null ||
                request.getName().isBlank()) {

            throw new RuntimeException("Name is required");
        }

        // Validate email
        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new RuntimeException("Email is required");
        }

        // Validate password
        if (request.getPassword() == null ||
                request.getPassword().length() < 6) {

            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }

        // Clean email
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Create user
        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);

        // Encrypt password using BCrypt
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // Every new signup is a normal USER
        user.setRole("USER");

        // Save user
        User savedUser = userRepository.save(user);

        // Return user information without password
        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getProfileImage()
        );
    }


    // =========================
    // LOGIN
    // =========================

    public LoginResponse login(LoginRequest request) {

        // Clean email
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // Generate JWT
        String token = jwtService.generateToken(
                user.getEmail()
        );

        // Create safe user response
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProfileImage()
        );

        // Return token + user
        return new LoginResponse(
                token,
                userResponse
        );
    }
}