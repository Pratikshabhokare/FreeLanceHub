package com.FreeLanceHub.Service;

import com.FreeLanceHub.Dto.ReviewDto;
import java.util.List;

public interface ReviewService {
    ReviewDto submitReview(ReviewDto reviewDto);

    List<ReviewDto> getReviewsByReviewee(Long revieweeId);

    List<ReviewDto> getReviewsByReviewer(Long reviewerId);

    Double getAverageRating(Long userId);
}
