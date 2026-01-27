package com.FreeLanceHub.ServiceImpl;

import com.FreeLanceHub.Dto.ChatDto;
import com.FreeLanceHub.Dto.MessageDto;
import com.FreeLanceHub.Entity.Chat;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.Message;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Repository.ChatRepo;
import com.FreeLanceHub.Repository.JobRepo;
import com.FreeLanceHub.Repository.MessageRepo;
import com.FreeLanceHub.Repository.UserRepo;
import com.FreeLanceHub.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepo chatRepo;
    @Autowired
    private MessageRepo messageRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private com.FreeLanceHub.Service.NotificationService notificationService;

    @Override
    public ChatDto createOrGetChat(Long jobId, Long freelancerId, Long clientId) {
        Job job = jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        User freelancer = userRepo.findById(freelancerId).orElseThrow(() -> new RuntimeException("Freelancer not found"));
        User client = userRepo.findById(clientId).orElseThrow(() -> new RuntimeException("Client not found"));

        Optional<Chat> existing = chatRepo.findByJobAndClientAndFreelancer(job, client, freelancer);
        Chat chat;
        if (existing.isPresent()) {
            chat = existing.get();
        } else {
            chat = new Chat(job, client, freelancer);
            chat = chatRepo.save(chat);
        }
        return mapToDto(chat, freelancerId); 
    }

    @Override
    public List<ChatDto> getUserChats(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Chat> chats = chatRepo.findByClientOrFreelancer(user, user);
        return chats.stream().map(chat -> mapToDto(chat, userId)).collect(Collectors.toList());
    }

    @Override
    public List<MessageDto> getChatMessages(Long chatId) {
        return messageRepo.findByChatIdOrderByCreatedAtAsc(chatId)
                .stream()
                .map(this::mapMessageToDto)
                .collect(Collectors.toList());
    }

    @Override
    public MessageDto sendMessage(Long chatId, Long senderId, String content) {
        Chat chat = chatRepo.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found"));
        User sender = userRepo.findById(senderId).orElseThrow(() -> new RuntimeException("User not found"));
        
        Message message = new Message(chat, sender, content);
        message = messageRepo.save(message);

        // Notify recipient
        User recipient = chat.getClient().getId().equals(senderId) ? chat.getFreelancer() : chat.getClient();
        notificationService.createNotification(
            recipient, 
            "New message from " + sender.getName(), 
            com.FreeLanceHub.Entity.NotificationType.MESSAGE_RECEIVED
        );
        
        return mapMessageToDto(message);
    }

    private ChatDto mapToDto(Chat chat, Long currentUserId) {
        ChatDto dto = new ChatDto();
        dto.setId(chat.getId());
        dto.setJobId(chat.getJob().getId());
        dto.setJobTitle(chat.getJob().getTitle());
        
        if (currentUserId != null) {
            boolean isClient = chat.getClient().getId().equals(currentUserId);
            User partner = isClient ? chat.getFreelancer() : chat.getClient();
            dto.setPartnerId(partner.getId());
            dto.setPartnerName(partner.getName());
        }
        
        // Populate last message
        List<Message> msgs = messageRepo.findByChatIdOrderByCreatedAtAsc(chat.getId());
        if (!msgs.isEmpty()) {
            Message last = msgs.get(msgs.size() - 1);
            dto.setLastMessage(last.getContent());
            dto.setLastMessageTime(last.getCreatedAt());
        }
        return dto;
    }

    private MessageDto mapMessageToDto(Message msg) {
        return new MessageDto(
            msg.getId(),
            msg.getChat().getId(),
            msg.getSender().getId(),
            msg.getSender().getName(),
            msg.getContent(),
            msg.getCreatedAt()
        );
    }
}
