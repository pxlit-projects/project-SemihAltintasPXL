package be.pxl.services.service;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.RejectPostRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public void changeConceptToApproved(Long postId) {
        logger.info("Changing post with ID {} to approved.", postId);
        rabbitTemplate.convertAndSend("approvePostQueue", postId);
        logger.info("Message sent to 'approvePostQueue' for post ID {}.", postId);
    }

    @Override
    public void changeConceptToRejected(RejectPostRequest rejectPostRequest) {
        logger.info("Changing post with ID {} to rejected.", rejectPostRequest.getPostId());
        Review review = createReview(rejectPostRequest);
        logger.info("Created review: {}", review);
        rabbitTemplate.convertAndSend("rejectPostQueue", rejectPostRequest.getPostId());
        logger.info("Message sent to 'rejectPostQueue' for post ID {}.", rejectPostRequest.getPostId());
        reviewRepository.save(review);
        logger.info("Review saved to the database: {}", review);
    }

    @Override
    public Review createReview(RejectPostRequest rejectPostRequest) {
        logger.debug("Creating review for RejectPostRequest: {}", rejectPostRequest);
        Review review = new Review();
        review.setPostId(rejectPostRequest.getPostId());
        review.setReviewAuthor(rejectPostRequest.getReviewAuthor());
        review.setReviewMessage(rejectPostRequest.getReviewMessage());
        logger.debug("Review created: {}", review);
        return review;
    }

    public ReviewResponse getReviewById(Long id) {
        logger.info("Fetching review for post ID {}.", id);
        return reviewRepository.findByPostId(id)
                .map(this::mapReviewToReviewResponse)
                .orElseGet(() -> {
                    logger.warn("No review found for post ID {}.", id);
                    return null;
                });
    }

    public ReviewResponse mapReviewToReviewResponse(Review review) {
        logger.debug("Mapping Review to ReviewResponse: {}", review);
        ReviewResponse reviewResponse = new ReviewResponse();
        reviewResponse.setId(review.getId());
        reviewResponse.setPostId(review.getPostId());
        reviewResponse.setReviewAuthor(review.getReviewAuthor());
        reviewResponse.setReviewMessage(review.getReviewMessage());
        logger.debug("Mapped ReviewResponse: {}", reviewResponse);
        return reviewResponse;
    }
}
