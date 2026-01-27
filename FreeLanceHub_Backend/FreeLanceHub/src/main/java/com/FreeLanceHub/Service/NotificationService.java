package com.FreeLanceHub.Service;

import com.FreeLanceHub.Dto.NotificationDto;
import com.FreeLanceHub.Entity.NotificationType;
import com.FreeLanceHub.Entity.User;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String message, NotificationType type);
    List<NotificationDto> getUserNotifications(Long userId);
    List<NotificationDto> getUnreadNotifications(Long userId);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
}
