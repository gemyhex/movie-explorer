import { defineStore } from 'pinia';
import apiClient from '../api';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const useMoviesStore = defineStore('movies', {
    state: () => ({
        movies: [],
        genres: [],
        searchQuery: '',
        selectedGenre: '',
        autocompleteResults: [],
        loading: false,
        error: null,
        cache: {},
    }),
    actions: {
        async fetchPopularMovies() {
            const cacheKey = 'popularMovies';
            if (this.cache[cacheKey]) {
                this.movies = this.cache[cacheKey];
                return;
            }

            NProgress.start();
            this.loading = true;
            this.error = null;

            try {
                const response = await this.withRetry(() =>
                    apiClient.get('/movie/popular')
                );
                this.movies = response.data.results;
                this.cache[cacheKey] = response.data.results;
            } catch (error) {
                this.error = 'Failed to fetch popular movies. Please try again later.';
                console.error('Error fetching popular movies:', error);
            } finally {
                // NProgress.done();
                this.loading = false;
            }
        },

        async searchMovies(query) {
            const cacheKey = `search:${query}`;
            if (this.cache[cacheKey]) {
                this.movies = this.cache[cacheKey];
                return;
            }

            NProgress.start();
            this.loading = true;
            this.error = null;

            try {
                const response = await this.withRetry(() =>
                    apiClient.get('/search/movie', { params: { query } })
                );
                this.movies = response.data.results;
                this.cache[cacheKey] = response.data.results;
            } catch (error) {
                this.error = 'Failed to search movies. Please try again later.';
                console.error('Error searching movies:', error);
            } finally {
                NProgress.done();
                this.loading = false;
            }
        },

        async fetchGenres() {
            const cacheKey = 'genres';
            if (this.cache[cacheKey]) {
                this.genres = this.cache[cacheKey];
                return;
            }

            NProgress.start();
            this.loading = true;
            this.error = null;

            try {
                const response = await this.withRetry(() =>
                    apiClient.get('/genre/movie/list')
                );
                this.genres = response.data.genres;
                this.cache[cacheKey] = response.data.genres;
            } catch (error) {
                this.error = 'Failed to fetch genres. Please try again later.';
                console.error('Error fetching genres:', error);
            } finally {
                NProgress.done();
                this.loading = false;
            }
        },

        async filterMoviesByGenre(genreId) {
            const cacheKey = `genre:${genreId}`;
            if (this.cache[cacheKey]) {
                this.movies = this.cache[cacheKey];
                return;
            }

            NProgress.start();
            this.loading = true;
            this.error = null;

            try {
                const response = await this.withRetry(() =>
                    apiClient.get('/discover/movie', { params: { with_genres: genreId } })
                );
                this.movies = response.data.results;
                this.cache[cacheKey] = response.data.results;
            } catch (error) {
                this.error = 'Failed to filter movies by genre. Please try again later.';
                console.error('Error filtering movies by genre:', error);
            } finally {
                NProgress.done();
                this.loading = false;
            }
        },

        async fetchAutocompleteResults(query) {
            const cacheKey = `autocomplete:${query}`;
            if (this.cache[cacheKey]) {
                this.autocompleteResults = this.cache[cacheKey];
                return;
            }

            NProgress.start();
            this.loading = true;
            this.error = null;

            try {
                const response = await this.withRetry(() =>
                    apiClient.get('/search/movie', { params: { query } })
                );
                this.autocompleteResults = response.data.results.slice(0, 5);
                this.cache[cacheKey] = response.data.results.slice(0, 5);
            } catch (error) {
                this.error = 'Failed to fetch autocomplete results. Please try again later.';
                console.error('Error fetching autocomplete results:', error);
            } finally {
                NProgress.done();
                this.loading = false;
            }
        },

        async fetchCombinedResults() {
            NProgress.start();
            this.loading = true;
            this.error = null;

            try {
                if (this.selectedGenre) {
                    await this.filterMoviesByGenre(this.selectedGenre);
                } else if (this.searchQuery) {
                    await this.searchMovies(this.searchQuery);
                } else {
                    await this.fetchPopularMovies();
                }
            } catch (error) {
                this.error = 'Failed to fetch movies. Please try again later.';
                console.error('Error fetching combined results:', error);
            } finally {
                NProgress.done();
                this.loading = false;
            }
        },

        async withRetry(requestFn, retries = 3, delay = 1000) {
            try {
                return await requestFn();
            } catch (error) {
                if (retries === 0) throw error;
                await new Promise((resolve) => setTimeout(resolve, delay));
                return this.withRetry(requestFn, retries - 1, delay);
            }
        },
    },
});