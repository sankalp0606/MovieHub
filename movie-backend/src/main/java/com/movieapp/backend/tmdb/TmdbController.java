package com.movieapp.backend.tmdb;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tmdb")
public class TmdbController {
    private final TmdbService tmdbService;

    public TmdbController(TmdbService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/trending")
    public ResponseEntity<String> getTrendingMovies(
            @RequestParam(value = "page", defaultValue = "1") Integer page) {
        return ResponseEntity.ok(tmdbService.getTrendingMovies(page));
    }

    @GetMapping("/discover/tv")
    public ResponseEntity<String> getDiscoverTv(
            @RequestParam(value = "page", defaultValue = "1") Integer page) {
        return ResponseEntity.ok(tmdbService.getDiscoverTv(page));
    }

    @GetMapping("/indian-movies")
    public ResponseEntity<String> getIndianMovies(
            @RequestParam(value = "page", defaultValue = "1") Integer page) {
        return ResponseEntity.ok(tmdbService.getIndianMovies(page));
    }

    @GetMapping("/discover/movie")
    public ResponseEntity<String> getMoviesByGenre(
            @RequestParam Integer genreId,
            @RequestParam(value = "page", defaultValue = "1") Integer page) {
        return ResponseEntity.ok(tmdbService.getMovieByGenre(genreId, page));
    }

    @GetMapping("/search")
    public ResponseEntity<String> search(
            @RequestParam String query) {
        return ResponseEntity.ok(tmdbService.searchMulti(query));
    }

    @GetMapping("/movie/{tmdbId}")
    public ResponseEntity<String> getMovieDetails(
            @PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.getMovieDetails(tmdbId));
    }

    @GetMapping("/tv/{tmdbId}")
    public ResponseEntity<String> getTvDetails(
            @PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.getTvDetails(tmdbId));
    }

    @GetMapping("/movie/{tmdbId}/credits")
    public ResponseEntity<String> getMovieCredits(
            @PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.getMovieCredits(tmdbId));
    }

    @GetMapping("/tv/{tmdbId}/credits")
    public ResponseEntity<String> getTvCredits(
            @PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.getTvCredits(tmdbId));
    }

    @GetMapping("/movie/{tmdbId}/videos")
    public ResponseEntity<String> getMovieVideos(
            @PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.getMovieVideos(tmdbId));
    }

    @GetMapping("/tv/{tmdbId}/videos")
    public ResponseEntity<String> getTvVideos(
            @PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.getTvVideos(tmdbId));
    }

    @GetMapping("/movie/{tmdbId}/similar")
    public ResponseEntity<String> getSimilarMovies(
            @PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.getSimilarMovies(tmdbId));
    }

    @GetMapping("/tv/{tmdbId}/similar")
    public ResponseEntity<String> getSimilarTv(
            @PathVariable Long tmdbId) {
        return ResponseEntity.ok(tmdbService.getSimilarTv(tmdbId));
    }
}
