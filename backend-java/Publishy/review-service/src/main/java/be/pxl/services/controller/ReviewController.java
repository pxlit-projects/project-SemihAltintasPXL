package be.pxl.services.controller;

import be.pxl.services.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/approve/{postId}")
    public void changeConceptToApproved(@PathVariable long postId) {
        reviewService.changeConceptToApproved(postId);
    }

}
