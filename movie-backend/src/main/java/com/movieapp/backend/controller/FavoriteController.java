package com.movieapp.backend.controller;

import com.movieapp.backend.entity.Favorite;
import com.movieapp.backend.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/{userId}/{movieId}")
    public ResponseEntity<Favorite> addFavorite(
            @PathVariable Long userId,
            @PathVariable Long movieId) {

        return ResponseEntity.ok(
                favoriteService.addFavorite(userId, movieId)
        );
    }

    @DeleteMapping("/{userId}/{movieId}")
    public ResponseEntity<String> removeFavorite(
            @PathVariable Long userId,
            @PathVariable Long movieId) {

        favoriteService.removeFavorite(userId, movieId);

        return ResponseEntity.ok("Favorite removed");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Favorite>> getUserFavorites(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                favoriteService.getUserFavorites(userId)
        );
    }

    @GetMapping("/check/{userId}/{movieId}")
    public ResponseEntity<Boolean> checkFavorite(
            @PathVariable Long userId,
            @PathVariable Long movieId) {

        return ResponseEntity.ok(
                favoriteService.isFavorite(userId, movieId)
        );
    }
}
