package com.FreeLanceHub.controller;

import com.FreeLanceHub.Dto.PaymentDto;
import com.FreeLanceHub.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay/{jobId}")
    public ResponseEntity<PaymentDto> processPayment(@PathVariable Long jobId, @RequestParam Long payerId) {
        return ResponseEntity.ok(paymentService.processPayment(jobId, payerId));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<PaymentDto>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getUserPaymentHistory(userId));
    }
}
