package com.FreeLanceHub.Service;

import com.FreeLanceHub.Dto.PaymentDto;
import java.util.List;

public interface PaymentService {
    PaymentDto processPayment(Long jobId, Long payerId);
    List<PaymentDto> getUserPaymentHistory(Long userId);
}
