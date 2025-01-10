package be.pxl.services.controller;


import be.pxl.services.domain.dto.NotificationRequest;
import be.pxl.services.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public void sendEmail(@RequestBody NotificationRequest notificationRequest) {
        notificationService.sendEmail(notificationRequest);
    }
}