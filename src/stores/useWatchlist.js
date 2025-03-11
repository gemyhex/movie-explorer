import { defineStore } from 'pinia';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const useWatchlistStore = defineStore('watchlist', {
    state: () => ({
        watchlist: [],
        removedMovie: null,
        isInitialized: false,
    }),
    actions: {
        addToWatchlist(movie) {
            const isDuplicate = this.watchlist.some((m) => m.id === movie.id);
            if (!isDuplicate) {
                this.watchlist.push(movie);
                this.saveToLocalStorage();
            }
        },

        removeFromWatchlist(movieId) {
            this.removedMovie = this.watchlist.find((m) => m.id === movieId);
            this.watchlist = this.watchlist.filter((m) => m.id !== movieId);
            this.saveToLocalStorage();
        },

        undoRemove() {
            if (this.removedMovie) {
                this.addToWatchlist(this.removedMovie);
                this.removedMovie = null;
            }
        },

        reorderWatchlist(newOrder) {
            this.watchlist = newOrder;
            this.saveToLocalStorage();
        },

        saveToLocalStorage() {
            localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
        },

        loadFromLocalStorage() {
            if (!this.isInitialized) {
                NProgress.start();
                const savedWatchlist = localStorage.getItem('watchlist');
                if (savedWatchlist) {
                    this.watchlist = JSON.parse(savedWatchlist);
                }
                this.isInitialized = true;
                NProgress.done();
            }
        },
    },
});