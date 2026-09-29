package com.medivault.service;

import com.medivault.dto.AuthDto.*;
import com.medivault.entity.User;
import com.medivault.repository.UserRepository;
import com.medivault.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + request.getUsername()));

        // Support both hashed passwords and legacy plain text passwords during transition
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword())
                || request.getPassword().equals(user.getPassword());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid password credentials.");
        }

        // If legacy plain password matched, update to BCrypt hash
        if (request.getPassword().equals(user.getPassword()) && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .username(user.getUsername())
                .role(user.getRole())
                .message("Login successful")
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .specialCharacter(request.getSpecialCharacter())
                .role(request.getRole() != null && !request.getRole().isBlank() ? request.getRole() : "ADMIN")
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();

        userRepository.save(user);

        String jwt = jwtUtils.generateTokenFromUsername(user.getUsername());

        return AuthResponse.builder()
                .token(jwt)
                .username(user.getUsername())
                .role(user.getRole())
                .message("User registered successfully")
                .build();
    }

    public ResetPasswordResult recoverPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmailAndPhoneAndSpecialCharacter(
                request.getEmail(),
                request.getPhone(),
                request.getSpecialCharacter()
        );

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResetPasswordResult.builder()
                    .username(user.getUsername())
                    .message("Account verified successfully.")
                    .success(true)
                    .build();
        } else {
            return ResetPasswordResult.builder()
                    .message("No matching records found. Please check your details.")
                    .success(false)
                    .build();
        }
    }
}
