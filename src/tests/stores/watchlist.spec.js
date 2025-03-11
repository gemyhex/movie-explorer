import { setActivePinia, createPinia } from 'pinia';
import { useWatchlistStore } from '../../stores/useWatchlist';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useWatchlistStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('adds a movie to the watchlist', () => {
        const store = useWatchlistStore();
        const movie = { id: 1, title: 'Movie 1' };

        store.addToWatchlist(movie);

        expect(store.watchlist).toHaveLength(1);
        expect(store.watchlist[0]).toEqual(movie);
    });

    it('prevents duplicate movies in the watchlist', () => {
        const store = useWatchlistStore();
        const movie = { id: 1, title: 'Movie 1' };

        store.addToWatchlist(movie);
        store.addToWatchlist(movie); // Try adding the same movie again

        expect(store.watchlist).toHaveLength(1);
    });

    it('removes a movie from the watchlist', () => {
        const store = useWatchlistStore();
        const movie = { id: 1, title: 'Movie 1' };

        store.addToWatchlist(movie);
        store.removeFromWatchlist(movie.id);

        expect(store.watchlist).toHaveLength(0);
    });

    it('undoes the last removal', () => {
        const store = useWatchlistStore();
        const movie = { id: 1, title: 'Movie 1' };

        store.addToWatchlist(movie);
        store.removeFromWatchlist(movie.id);
        store.undoRemove();

        expect(store.watchlist).toHaveLength(1);
        expect(store.watchlist[0]).toEqual(movie);
    });

    it('saves and loads the watchlist from localStorage', () => {
        const store = useWatchlistStore();
        const movie = { id: 1, title: 'Movie 1' };

        store.addToWatchlist(movie);
        store.saveToLocalStorage();

        // Simulate reloading the store
        const newStore = useWatchlistStore();
        newStore.loadFromLocalStorage();

        expect(newStore.watchlist).toHaveLength(1);
        expect(newStore.watchlist[0]).toEqual(movie);
    });
});