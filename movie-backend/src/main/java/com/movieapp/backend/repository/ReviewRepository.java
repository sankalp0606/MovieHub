package com.movieapp.backend.repository;

import com.movieapp.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByMovieId(Long movieId);

    List<Review> findByUserId(Long userId);

    Optional<Review> findByUserIdAndMovieId(Long userId, Long movieId);
}
