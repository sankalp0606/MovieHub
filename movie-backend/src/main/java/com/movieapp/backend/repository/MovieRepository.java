package com.movieapp.backend.repository;

import com.movieapp.backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByTmdbIdAndMediaType(Long tmdbId, String mediaType);
}
