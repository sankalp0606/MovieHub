package com.movieapp.backend.tmdb;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TmdbControllerTest {

    @Test
    void discoverTvEndpointWithPage() {
        TmdbService tmdbService = mock(TmdbService.class);
        when(tmdbService.getDiscoverTv(2)).thenReturn("{\"page\":2,\"results\":[]}");

        TmdbController controller = new TmdbController(tmdbService);
        ResponseEntity<String> response = controller.getDiscoverTv(2);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"page\":2,\"results\":[]}", response.getBody());
    }

    @Test
    void trendingEndpointWithPage() {
        TmdbService tmdbService = mock(TmdbService.class);
        when(tmdbService.getTrendingMovies(1)).thenReturn("{\"page\":1,\"results\":[]}");

        TmdbController controller = new TmdbController(tmdbService);
        ResponseEntity<String> response = controller.getTrendingMovies(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"page\":1,\"results\":[]}", response.getBody());
    }

    @Test
    void indianMoviesEndpointWithPage() {
        TmdbService tmdbService = mock(TmdbService.class);
        when(tmdbService.getIndianMovies(1)).thenReturn("{\"page\":1,\"results\":[]}");

        TmdbController controller = new TmdbController(tmdbService);
        ResponseEntity<String> response = controller.getIndianMovies(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"page\":1,\"results\":[]}", response.getBody());
    }

    @Test
    void discoverMovieGenreEndpointWithPage() {
        TmdbService tmdbService = mock(TmdbService.class);
        when(tmdbService.getMovieByGenre(28, 3)).thenReturn("{\"page\":3,\"results\":[]}");

        TmdbController controller = new TmdbController(tmdbService);
        ResponseEntity<String> response = controller.getMoviesByGenre(28, 3);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"page\":3,\"results\":[]}", response.getBody());
    }
}
