package be.pxl.services.service;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.RejectPostRequest;

public interface IReviewService {
    void changeConceptToApproved(Long postId);
    void changeConceptToRejected(Long postId, RejectPostRequest rejectPostRequest);
    Review createReview(RejectPostRequest review);

}
