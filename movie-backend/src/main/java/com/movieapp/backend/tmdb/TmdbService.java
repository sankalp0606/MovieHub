package com.movieapp.backend.tmdb;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class TmdbService {

    private final RestClient restClient;

    public TmdbService(
            @Value("${tmdb.base.url:https://api.themoviedb.org/3}") String baseUrl,
            @Value("${tmdb.api.key:}") String apiKey) {

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Accept", "application/json")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public String getTrendingMovies() {
        return getTrendingMovies(1);
    }

    public String getTrendingMovies(Integer page) {
        int pageNum = (page == null || page < 1) ? 1 : page;
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/trending/movie/day")
                        .queryParam("page", pageNum)
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getDiscoverTv() {
        return getDiscoverTv(1);
    }

    public String getDiscoverTv(Integer page) {
        int pageNum = (page == null || page < 1) ? 1 : page;
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/tv")
                        .queryParam("sort_by", "popularity.desc")
                        .queryParam("page", pageNum)
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getIndianMovies() {
        return getIndianMovies(1);
    }

    public String getIndianMovies(Integer page) {
        int pageNum = (page == null || page < 1) ? 1 : page;
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("with_origin_country", "IN")
                        .queryParam("watch_region", "IN")
                        .queryParam("sort_by", "popularity.desc")
                        .queryParam("page", pageNum)
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getMovieByGenre(Integer genreId) {
        return getMovieByGenre(genreId, 1);
    }

    public String getMovieByGenre(Integer genreId, Integer page) {
        if (genreId == null || genreId <= 0) {
            throw new IllegalArgumentException("genreId must be a positive integer");
        }
        int pageNum = (page == null || page < 1) ? 1 : page;

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("with_genres", genreId)
                        .queryParam("sort_by", "popularity.desc")
                        .queryParam("page", pageNum)
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String searchMulti(String query) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/multi")
                        .queryParam("query", query)
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getMovieDetails(Long tmdbId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + tmdbId)
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getTvDetails(Long tmdbId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tv/" + tmdbId)
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getMovieCredits(Long tmdbId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + tmdbId + "/credits")
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getTvCredits(Long tmdbId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tv/" + tmdbId + "/credits")
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getMovieVideos(Long tmdbId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + tmdbId + "/videos")
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getTvVideos(Long tmdbId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tv/" + tmdbId + "/videos")
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getSimilarMovies(Long tmdbId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + tmdbId + "/similar")
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getSimilarTv(Long tmdbId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tv/" + tmdbId + "/similar")
                        .build())
                .retrieve()
                .body(String.class);
    }
}

