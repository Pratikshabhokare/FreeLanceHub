package com.FreeLanceHub.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.FreeLanceHub.Entity.Chat;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.User;

@Repository
public interface ChatRepo extends JpaRepository<Chat, Long> {

    // Find chat between a specific client and freelancer for a job
    Optional<Chat> findByJobAndClientAndFreelancer(Job job, User client, User freelancer);

    // Find all chats for a specific user (either as client or freelancer)
    List<Chat> findByClientOrFreelancer(User client, User freelancer);
    
    // More specific:
    List<Chat> findByClientId(Long clientId);
    List<Chat> findByFreelancerId(Long freelancerId);
}
