package com.movieapp.backend.service;

import com.movieapp.backend.entity.Favorite;
import com.movieapp.backend.entity.Movie;
import com.movieapp.backend.entity.User;
import com.movieapp.backend.repository.FavoriteRepository;
import com.movieapp.backend.repository.MovieRepository;
import com.movieapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public FavoriteService(
            FavoriteRepository favoriteRepository,
            UserRepository userRepository,
            MovieRepository movieRepository) {

        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    public Favorite addFavorite(Long userId, Long movieId) {

        if (favoriteRepository.existsByUserIdAndMovieId(userId, movieId)) {
            throw new RuntimeException("Movie is already in favorites");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Favorite favorite = new Favorite(user, movie);

        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long userId, Long movieId) {

        Favorite favorite = favoriteRepository
                .findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));

        favoriteRepository.delete(favorite);
    }

    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public boolean isFavorite(Long userId, Long movieId) {
        return favoriteRepository.existsByUserIdAndMovieId(userId, movieId);
    }
}
