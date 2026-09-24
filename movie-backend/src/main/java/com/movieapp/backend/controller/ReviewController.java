package com.movieapp.backend.controller;

import com.movieapp.backend.entity.Review;
import com.movieapp.backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<Review> createReview(
            @RequestParam Long userId,
            @RequestParam Long movieId,
            @RequestParam Integer rating,
            @RequestParam String comment) {

        return ResponseEntity.ok(
                reviewService.createReview(
                        userId,
                        movieId,
                        rating,
                        comment
                )
        );
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Review>> getMovieReviews(
            @PathVariable Long movieId) {

        return ResponseEntity.ok(
                reviewService.getMovieReviews(movieId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                reviewService.getUserReviews(userId)
        );
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long reviewId,
            @RequestParam Integer rating,
            @RequestParam String comment) {

        return ResponseEntity.ok(
                reviewService.updateReview(
                        reviewId,
                        rating,
                        comment
                )
        );
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId) {

        reviewService.deleteReview(reviewId);

        return ResponseEntity.ok("Review deleted");
    }
}
