package com.FreeLanceHub.controller;

import com.FreeLanceHub.Dto.AuthResponse;
import com.FreeLanceHub.Dto.LoginRequest;
import com.FreeLanceHub.Dto.RegisterRequest;
import com.FreeLanceHub.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin // Allow testing from other origins easily
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        return authService.forgotPassword(email);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return "Password reset successfully";
    }

    @PostMapping("/reset-password-direct")
    public String resetPasswordDirect(@RequestParam String email, @RequestParam String newPassword) {
        authService.updatePasswordDirectly(email, newPassword);
        return "Password updated successfully";
    }
}
