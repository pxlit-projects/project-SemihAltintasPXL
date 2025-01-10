package be.pxl.services.service;

import be.pxl.services.domain.Notification;
import be.pxl.services.domain.dto.NotificationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(NotificationRequest notificationRequest) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(notificationRequest.getReceiver());
        message.setSubject(notificationRequest.getSubject());
        message.setText(notificationRequest.getMessage());
        mailSender.send(message);
    }
}