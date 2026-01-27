package com.FreeLanceHub.ServiceImpl;

import com.FreeLanceHub.Dto.PaymentDto;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.JobStatus;
import com.FreeLanceHub.Entity.Payment;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Repository.JobRepo;
import com.FreeLanceHub.Repository.PaymentRepo;
import com.FreeLanceHub.Repository.UserRepo;
import com.FreeLanceHub.Service.PaymentService;
import com.FreeLanceHub.Service.NotificationService;
import com.FreeLanceHub.Entity.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;
    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private NotificationService notificationService;

    @Override
    public PaymentDto processPayment(Long jobId, Long payerId) {
        Job job = jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        User payer = userRepo.findById(payerId).orElseThrow(() -> new RuntimeException("Payer not found"));

        if (!job.getClient().getId().equals(payerId)) {
            throw new RuntimeException("Only the job owner can pay for this job.");
        }

        if (job.getAssignedFreelancer() == null) {
            throw new RuntimeException("No freelancer assigned to this job.");
        }

        if (job.getStatus() == JobStatus.COMPLETED) {
            throw new RuntimeException("Job is already completed and paid.");
        }

        User payee = job.getAssignedFreelancer();
        Double amount = job.getBudget() != null ? job.getBudget() : 0.0; // Assume fixed budget for MVP

        Payment payment = new Payment();
        payment.setJob(job);
        payment.setPayer(payer);
        payment.setPayee(payee);
        payment.setAmount(amount);
        payment.setTransactionId(UUID.randomUUID().toString());
        // createdAt handled by BaseEntity

        payment = paymentRepo.save(payment);

        // Update Job Status
        job.setStatus(JobStatus.COMPLETED);
        jobRepo.save(job);

        // Notify Freelancer
        notificationService.createNotification(
            payee,
            "You received a payment of $" + amount + " for job: " + job.getTitle(),
            NotificationType.PAYMENT_RELEASED
        );

        return mapToDto(payment);
    }

    @Override
    public List<PaymentDto> getUserPaymentHistory(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Payment> asPayer = paymentRepo.findByPayer(user);
        List<Payment> asPayee = paymentRepo.findByPayee(user);
        
        List<Payment> all = new ArrayList<>();
        all.addAll(asPayer);
        all.addAll(asPayee);
        
        // Sort by date desc
        all.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));

        return all.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private PaymentDto mapToDto(Payment p) {
        return new PaymentDto(
            p.getId(),
            p.getJob().getId(),
            p.getJob().getTitle(),
            p.getPayer().getId(),
            p.getPayer().getName(),
            p.getPayee().getId(),
            p.getPayee().getName(),
            p.getAmount(),
            p.getTransactionId(),
            p.getCreatedAt()
        );
    }
}
