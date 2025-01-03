package be.pxl.services.service;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.RejectPostRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public void changeConceptToApproved(Long postId) {

        rabbitTemplate.convertAndSend("approvePostQueue", postId);
    }

    @Override
    public void changeConceptToRejected(RejectPostRequest rejectPostRequest) {
        Review review = createReview(rejectPostRequest);
        rabbitTemplate.convertAndSend("rejectPostQueue", rejectPostRequest.getPostId());
        reviewRepository.save(review);
    }

    @Override
    public Review createReview(RejectPostRequest rejectPostRequest) {
        Review review = new Review();
        review.setPostId(rejectPostRequest.getPostId());
        review.setReviewAuthor(rejectPostRequest.getReviewAuthor());
        review.setReviewMessage(rejectPostRequest.getReviewMessage());
        return review;
    }
    public ReviewResponse getReviewById(Long id) {
        return reviewRepository.findByPostId(id).map(this::mapReviewToReviewResponse).orElse(null);
    }

    private ReviewResponse mapReviewToReviewResponse(Review review) {
        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setId(review.getId());
        reviewResponse.setPostId(review.getPostId());
        reviewResponse.setReviewAuthor(review.getReviewAuthor());
        reviewResponse.setReviewMessage(review.getReviewMessage());
        return reviewResponse;
    }

}
