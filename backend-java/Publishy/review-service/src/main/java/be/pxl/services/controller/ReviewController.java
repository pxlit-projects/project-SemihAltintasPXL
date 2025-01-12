package be.pxl.services.controller;

import be.pxl.services.domain.dto.RejectPostRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/approve/{postId}")
    public void changeConceptToApproved(@PathVariable Long postId) {
        reviewService.changeConceptToApproved(postId);
    }
    @PostMapping("/reject")
    public void changeConceptToRejected(@RequestHeader("user-role") String userRole, @RequestBody RejectPostRequest rejectPostRequest) {
        if (!userRole.equals("editor")) {
            throw new RuntimeException("Only editor can reject posts.");
        }
        else {
            reviewService.changeConceptToRejected(rejectPostRequest);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) {
        return new ResponseEntity<>(reviewService.getReviewById(id), HttpStatus.OK);
    }

}
