package com.movieapp.backend.service;

import com.movieapp.backend.entity.Movie;
import com.movieapp.backend.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // Create a movie (or return existing if already present)
    public Movie createMovie(Movie movie) {
        if (movie.getTmdbId() != null && movie.getMediaType() != null) {
            Optional<Movie> existing = movieRepository.findByTmdbIdAndMediaType(
                    movie.getTmdbId(), movie.getMediaType().toLowerCase()
            );
            if (existing.isPresent()) {
                return existing.get();
            }
            movie.setMediaType(movie.getMediaType().toLowerCase());
        }
        return movieRepository.save(movie);
    }

    // Get all movies
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // Get movie by ID
    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    // Get movie by TMDB ID and Media Type
    public Optional<Movie> getMovieByTmdbIdAndMediaType(Long tmdbId, String mediaType) {
        if (tmdbId == null || mediaType == null) {
            return Optional.empty();
        }
        return movieRepository.findByTmdbIdAndMediaType(tmdbId, mediaType.toLowerCase());
    }
}
