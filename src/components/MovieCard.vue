<template>
  <div class="movie-card">
    <img
        v-lazy="imageUrl"
        :alt="movie.title"
        class="movie-poster"
        @load="handleImageLoad"
    />
    <div v-if="!imageLoaded" class="skeleton-loader"></div>

    <div class="overlay">
      <button v-if="!isWatchListItem" @click="addToWatchlist(movie)">Add to Watchlist</button>
      <button v-else @click="removeFromWatchlist(movie?.id)">Remove</button>
    </div>

    <div class="details">
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.release_date }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useWatchlistStore } from '../stores/useWatchlist';

const watchlistStore = useWatchlistStore();

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  isWatchListItem: {
    type: Boolean,
  },
});

const imageUrl = `https://image.tmdb.org/t/p/original/${props.movie.poster_path}`;
const imageLoaded = ref(false);

const handleImageLoad = () => {
  imageLoaded.value = true;
};

const addToWatchlist = (movie) => {
  watchlistStore.addToWatchlist(movie);
};

const removeFromWatchlist = (movieId) => {
  watchlistStore.removeFromWatchlist(movieId);
};
</script>