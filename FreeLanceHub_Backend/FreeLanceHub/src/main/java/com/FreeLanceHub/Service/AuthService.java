package com.FreeLanceHub.Service;

import com.FreeLanceHub.Dto.AuthResponse;
import com.FreeLanceHub.Dto.LoginRequest;
import com.FreeLanceHub.Dto.RegisterRequest;
import com.FreeLanceHub.Entity.Role;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Repository.UserRepo;
import com.FreeLanceHub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    public void register(RegisterRequest request) {
        if (userRepo.findByUserName(request.getUserName()) != null) {
            throw new RuntimeException("User already exists");
        }
        User user = new User();
        user.setUserName(request.getUserName());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Parse role from request or default to CLIENT
        Role role = Role.CLIENT;
        if (request.getRole() != null) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                role = Role.CLIENT;
            }
        }
        user.setRole(role);
        user.setEnabled(true);
        userRepo.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getUserName(), request.getPassword()));
        User user = userRepo.findByUserName(request.getUserName());
        String token = jwtUtil.generateToken(request.getUserName());
        return new AuthResponse(token, user);
    }

    public String forgotPassword(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String token = java.util.UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1)); // Token valid for 1 hour
        userRepo.save(user);

        // In a real app, send this token via email.
        // For now, return it so the frontend can simulate the link.
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepo.findByResetToken(token).orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepo.save(user);
    }

    public void updatePasswordDirectly(String email, String newPassword) {
        User user = userRepo.findByEmail(email.trim())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        user.setPassword(passwordEncoder.encode(newPassword));
        // Clear any existing reset tokens to be clean
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepo.save(user);
    }
}
