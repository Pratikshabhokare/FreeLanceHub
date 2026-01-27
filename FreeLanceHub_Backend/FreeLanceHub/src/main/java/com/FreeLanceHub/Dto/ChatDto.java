package com.FreeLanceHub.Dto;

import java.time.LocalDateTime;

public class ChatDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long partnerId;
    private String partnerName;
    private String lastMessage;
    private LocalDateTime lastMessageTime;

    public ChatDto() {}

    public ChatDto(Long id, Long jobId, String jobTitle, Long partnerId, String partnerName) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.partnerId = partnerId;
        this.partnerName = partnerName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public Long getPartnerId() { return partnerId; }
    public void setPartnerId(Long partnerId) { this.partnerId = partnerId; }
    public String getPartnerName() { return partnerName; }
    public void setPartnerName(String partnerName) { this.partnerName = partnerName; }
    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
    public LocalDateTime getLastMessageTime() { return lastMessageTime; }
    public void setLastMessageTime(LocalDateTime lastMessageTime) { this.lastMessageTime = lastMessageTime; }
}
