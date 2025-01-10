package be.pxl.services;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.RejectPostRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import be.pxl.services.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void changeConceptToApproved_ShouldSendToApprovePostQueue() {
        Long postId = 1L;

        reviewService.changeConceptToApproved(postId);

        verify(rabbitTemplate, times(1)).convertAndSend("approvePostQueue", postId);
    }

    @Test
    void changeConceptToRejected_ShouldCreateReviewAndSendToRejectPostQueue() {
        RejectPostRequest rejectPostRequest = new RejectPostRequest();
        rejectPostRequest.setPostId(1L);
        rejectPostRequest.setReviewAuthor("Author");
        rejectPostRequest.setReviewMessage("Message");

        Review review = new Review();
        review.setPostId(rejectPostRequest.getPostId());
        review.setReviewAuthor(rejectPostRequest.getReviewAuthor());
        review.setReviewMessage(rejectPostRequest.getReviewMessage());

        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        reviewService.changeConceptToRejected(rejectPostRequest);

        verify(rabbitTemplate, times(1)).convertAndSend("rejectPostQueue", rejectPostRequest.getPostId());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void createReview_ShouldReturnReview() {
        RejectPostRequest rejectPostRequest = new RejectPostRequest();
        rejectPostRequest.setPostId(1L);
        rejectPostRequest.setReviewAuthor("Author");
        rejectPostRequest.setReviewMessage("Message");

        Review review = reviewService.createReview(rejectPostRequest);

        assertNotNull(review);
        assertEquals(rejectPostRequest.getPostId(), review.getPostId());
        assertEquals(rejectPostRequest.getReviewAuthor(), review.getReviewAuthor());
        assertEquals(rejectPostRequest.getReviewMessage(), review.getReviewMessage());
    }

    @Test
    void getReviewById_ShouldReturnReviewResponse_WhenReviewExists() {
        Long postId = 1L;
        Review review = new Review();
        review.setId(1L);
        review.setPostId(postId);
        review.setReviewAuthor("Author");
        review.setReviewMessage("Message");

        when(reviewRepository.findByPostId(postId)).thenReturn(Optional.of(review));

        ReviewResponse response = reviewService.getReviewById(postId);

        assertNotNull(response);
        assertEquals(review.getId(), response.getId());
        assertEquals(review.getPostId(), response.getPostId());
        assertEquals(review.getReviewAuthor(), response.getReviewAuthor());
        assertEquals(review.getReviewMessage(), response.getReviewMessage());
    }

    @Test
    void getReviewById_ShouldReturnNull_WhenReviewDoesNotExist() {
        Long postId = 1L;

        when(reviewRepository.findByPostId(postId)).thenReturn(Optional.empty());

        ReviewResponse response = reviewService.getReviewById(postId);

        assertNull(response);
    }

    @Test
    void mapReviewToReviewResponse_ShouldMapReviewCorrectly() {
        Review review = new Review();
        review.setId(1L);
        review.setPostId(1L);
        review.setReviewAuthor("Author");
        review.setReviewMessage("Message");

        ReviewResponse response = reviewService.mapReviewToReviewResponse(review);

        assertNotNull(response);
        assertEquals(review.getId(), response.getId());
        assertEquals(review.getPostId(), response.getPostId());
        assertEquals(review.getReviewAuthor(), response.getReviewAuthor());
        assertEquals(review.getReviewMessage(), response.getReviewMessage());
    }
}
