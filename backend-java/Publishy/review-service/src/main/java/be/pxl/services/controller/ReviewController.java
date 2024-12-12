package be.pxl.services.controller;

import be.pxl.services.domain.dto.RejectPostRequest;
import be.pxl.services.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/approve/{postId}")
    public void changeConceptToApproved(@PathVariable Long postId) {
        reviewService.changeConceptToApproved(postId);
    }
    @PostMapping("/reject/{postId}")
    public void changeConceptToRejected(@PathVariable Long postId, @RequestBody RejectPostRequest rejectPostRequest) {
        reviewService.changeConceptToRejected(postId, rejectPostRequest);
    }

}
