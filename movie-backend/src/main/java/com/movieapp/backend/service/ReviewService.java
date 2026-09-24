package com.movieapp.backend.service;

import com.movieapp.backend.entity.Movie;
import com.movieapp.backend.entity.Review;
import com.movieapp.backend.entity.User;
import com.movieapp.backend.repository.MovieRepository;
import com.movieapp.backend.repository.ReviewRepository;
import com.movieapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            MovieRepository movieRepository) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    public Review createReview(
            Long userId,
            Long movieId,
            Integer rating,
            String comment) {

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        if (reviewRepository.findByUserIdAndMovieId(userId, movieId).isPresent()) {
            throw new RuntimeException("You already reviewed this movie");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Review review = new Review(user, movie, rating, comment);

        return reviewRepository.save(review);
    }

    public List<Review> getMovieReviews(Long movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public Review updateReview(
            Long reviewId,
            Integer rating,
            String comment) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    public void deleteReview(Long reviewId) {

        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Review not found");
        }

        reviewRepository.deleteById(reviewId);
    }
}
