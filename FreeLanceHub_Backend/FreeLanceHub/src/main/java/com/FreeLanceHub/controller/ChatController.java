package com.FreeLanceHub.controller;

import com.FreeLanceHub.Dto.ChatDto;
import com.FreeLanceHub.Dto.MessageDto;
import com.FreeLanceHub.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // Create or get existing chat
    @PostMapping("/create")
    public ResponseEntity<ChatDto> createOrGetChat(
            @RequestParam Long jobId,
            @RequestParam Long freelancerId,
            @RequestParam Long clientId) {
        return ResponseEntity.ok(chatService.createOrGetChat(jobId, freelancerId, clientId));
    }

    // Get user chats
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatDto>> getUserChats(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUserChats(userId));
    }

    // Get messages
    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<MessageDto>> getChatMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.getChatMessages(chatId));
    }

    // Send message
    @PostMapping("/{chatId}/send")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long chatId,
            @RequestParam Long senderId,
            @RequestBody String content) {
        return ResponseEntity.ok(chatService.sendMessage(chatId, senderId, content));
    }
}
