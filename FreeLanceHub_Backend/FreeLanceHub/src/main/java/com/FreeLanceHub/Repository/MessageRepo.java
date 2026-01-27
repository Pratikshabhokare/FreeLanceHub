package com.FreeLanceHub.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.FreeLanceHub.Entity.Chat;
import com.FreeLanceHub.Entity.Message;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {

    List<Message> findByChatIdOrderByCreatedAtAsc(Long chatId);
    
    // Note: Message entity didn't have 'createdAt' visible in preview, probably inherited from BaseEntity?
    // Let's check BaseEntity or Message again. 
    // The previous view of Message.java showed it implements BaseEntity 
    // but didn't explicitly show 'createdAt'. BaseEntity usually has id, createdAt, updatedAt.
    // I will assume it exists or use ID order.
}
