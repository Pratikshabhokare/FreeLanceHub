package com.FreeLanceHub.controller;

import com.FreeLanceHub.Dto.ReviewDto;
import com.FreeLanceHub.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/submit")
    public ResponseEntity<ReviewDto> submitReview(@RequestBody ReviewDto reviewDto) {
        return ResponseEntity.ok(reviewService.submitReview(reviewDto));
    }

    @GetMapping("/reviewee/{id}")
    public ResponseEntity<List<ReviewDto>> getReviewsByReviewee(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsByReviewee(id));
    }

    @GetMapping("/reviewer/{id}")
    public ResponseEntity<List<ReviewDto>> getReviewsByReviewer(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsByReviewer(id));
    }

    @GetMapping("/rating/{id}")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getAverageRating(id));
    }
}
