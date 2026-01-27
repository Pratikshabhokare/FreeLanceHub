package com.FreeLanceHub.Service;

import com.FreeLanceHub.Dto.ChatDto;
import com.FreeLanceHub.Dto.MessageDto;
import java.util.List;

public interface ChatService {
    
    // Create or retrieve existing chat
    ChatDto createOrGetChat(Long jobId, Long freelancerId, Long clientId);

    // Get all chats for a user
    List<ChatDto> getUserChats(Long userId);

    // Get messages for a chat
    List<MessageDto> getChatMessages(Long chatId);

    // Send a message
    MessageDto sendMessage(Long chatId, Long senderId, String content);
}
