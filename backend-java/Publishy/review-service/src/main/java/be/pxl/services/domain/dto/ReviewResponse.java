package be.pxl.services.domain.dto;

import be.pxl.services.domain.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long postId;
    private String reviewAuthor;
    private String reviewMessage;
}
