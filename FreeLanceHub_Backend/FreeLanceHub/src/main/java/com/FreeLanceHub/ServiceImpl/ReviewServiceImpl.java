package com.FreeLanceHub.ServiceImpl;

import com.FreeLanceHub.Dto.ReviewDto;
import com.FreeLanceHub.Entity.Job;
import com.FreeLanceHub.Entity.Review;
import com.FreeLanceHub.Entity.User;
import com.FreeLanceHub.Repository.JobRepo;
import com.FreeLanceHub.Repository.ReviewRepo;
import com.FreeLanceHub.Repository.UserRepo;
import com.FreeLanceHub.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JobRepo jobRepo;

    @Override
    public ReviewDto submitReview(ReviewDto reviewDto) {
        Review review = new Review();

        User reviewer = userRepo.findById(reviewDto.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        User reviewee = userRepo.findById(reviewDto.getRevieweeId())
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));
        Job job = jobRepo.findById(reviewDto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setJob(job);
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());

        Review saved = reviewRepo.save(review);
        return mapToDto(saved);
    }

    @Override
    public List<ReviewDto> getReviewsByReviewee(Long revieweeId) {
        return reviewRepo.findByRevieweeId(revieweeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDto> getReviewsByReviewer(Long reviewerId) {
        return reviewRepo.findByReviewerId(reviewerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Double getAverageRating(Long userId) {
        List<Review> reviews = reviewRepo.findByRevieweeId(userId);
        if (reviews.isEmpty())
            return 0.0;
        return reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
    }

    private ReviewDto mapToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setJobId(review.getJob().getId());
        dto.setJobTitle(review.getJob().getTitle());
        dto.setReviewerId(review.getReviewer().getId());
        dto.setReviewerName(review.getReviewer().getName());
        dto.setRevieweeId(review.getReviewee().getId());
        dto.setRevieweeName(review.getReviewee().getName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setReviewDate(review.getReviewDate());
        return dto;
    }
}
