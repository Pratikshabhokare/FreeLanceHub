package com.FreeLanceHub.ServiceImpl;

import com.FreeLanceHub.Dto.NotificationDto;
import com.FreeLanceHub.Entity.Notification;
import com.FreeLanceHub.Entity.NotificationType;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Repository.NotificationRepo;
import com.FreeLanceHub.Repository.UserRepo;
import com.FreeLanceHub.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepo notificationRepo;
    @Autowired
    private UserRepo userRepo;

    @Override
    public void createNotification(User user, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type); // Using Enum
        notification.setRead(false);
        // CreatedAt handled by BaseEntity or manually? Notification Entity has createdAt field manually added in my creation step, 
        // OR it extends BaseEntity which has it. 
        // Let's assume BaseEntity handles it or Setter exists.
        // My previous view of Notification showed it extends BaseEntity.
        notificationRepo.save(notification);
    }

    @Override
    public List<NotificationDto> getUserNotifications(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepo.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> getUnreadNotifications(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepo.findByUserAndIsReadOrderByCreatedAtDesc(user, false).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepo.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        notificationRepo.save(n);
    }
    
    @Override
    public void markAllAsRead(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Notification> unread = notificationRepo.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
        for(Notification n : unread) {
            n.setRead(true);
        }
        notificationRepo.saveAll(unread);
    }

    private NotificationDto mapToDto(Notification n) {
        return new NotificationDto(
            n.getId(),
            n.getMessage(),
            n.getType().toString(),
            n.isRead(),
            n.getCreatedAt()
        );
    }
}
