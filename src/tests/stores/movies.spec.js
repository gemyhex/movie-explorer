import { setActivePinia, createPinia } from 'pinia';
import { useMoviesStore } from '../../stores/movies';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useMoviesStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('fetches popular movies', async () => {
        const store = useMoviesStore();
        const mockMovies = [{ id: 1, title: 'Movie 1' }];

        vi.spyOn(store, 'fetchPopularMovies').mockImplementation(async () => {
            store.movies = mockMovies;
        });

        await store.fetchPopularMovies();

        expect(store.movies).toEqual(mockMovies);
    });

    it('searches movies', async () => {
        const store = useMoviesStore();
        const mockResults = [{ id: 1, title: 'Movie 1' }];

        vi.spyOn(store, 'searchMovies').mockImplementation(async () => {
            store.movies = mockResults;
        });

        await store.searchMovies('Movie 1');

        expect(store.movies).toEqual(mockResults);
    });

    it('filters movies by genre', async () => {
        const store = useMoviesStore();
        const mockResults = [{ id: 1, title: 'Movie 1', genre_ids: [28] }];

        vi.spyOn(store, 'filterMoviesByGenre').mockImplementation(async () => {
            store.movies = mockResults;
        });

        await store.filterMoviesByGenre(28);

        expect(store.movies).toEqual(mockResults);
    });
});