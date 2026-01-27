package com.FreeLanceHub.Repository;

import com.FreeLanceHub.Entity.Payment;
import com.FreeLanceHub.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
    List<Payment> findByPayer(User payer);
    List<Payment> findByPayee(User payee);
    List<Payment> findByJobId(Long jobId);
}
