package com.FreeLanceHub.Dto;

import java.time.LocalDateTime;

public class PaymentDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long payerId;
    private String payerName;
    private Long payeeId;
    private String payeeName;
    private Double amount;
    private String transactionId;
    private LocalDateTime paymentDate;

    public PaymentDto() {}

    public PaymentDto(Long id, Long jobId, String jobTitle, Long payerId, String payerName, Long payeeId, String payeeName, Double amount, String transactionId, LocalDateTime paymentDate) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.payerId = payerId;
        this.payerName = payerName;
        this.payeeId = payeeId;
        this.payeeName = payeeName;
        this.amount = amount;
        this.transactionId = transactionId;
        this.paymentDate = paymentDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public Long getPayerId() { return payerId; }
    public void setPayerId(Long payerId) { this.payerId = payerId; }
    public String getPayerName() { return payerName; }
    public void setPayerName(String payerName) { this.payerName = payerName; }
    public Long getPayeeId() { return payeeId; }
    public void setPayeeId(Long payeeId) { this.payeeId = payeeId; }
    public String getPayeeName() { return payeeName; }
    public void setPayeeName(String payeeName) { this.payeeName = payeeName; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
}
