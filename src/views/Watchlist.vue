<template>
  <div class="container">
    <h1>My Watchlist</h1>
    <div v-if="watchlistStore.removedMovie" class="undo-container">
      <button @click="watchlistStore.undoRemove">Undo Remove</button>
    </div>

    <div v-if="watchlistStore.watchlist.length === 0" class="empty-state">
      Your watchlist is empty. Start adding movies from the <router-link to="/">Home</router-link> page!
    </div>

    <div class="movie-grid" v-else>
      <MovieCard
          v-for="movie in watchlistStore.watchlist"
          :key="movie.id"
          :movie="movie"
          class="movie-card"
          draggable="true"
          @dragstart="handleDragStart($event, movie)"
          @dragover.prevent="handleDragOver($event, movie)"
          @drop="handleDrop($event, movie)"
          is-watch-list-item
      />
    </div>
  </div>
</template>

<script setup>
import {onBeforeMount, onMounted} from 'vue';
import { useWatchlistStore } from '../stores/useWatchlist';
import MovieCard from "../components/MovieCard.vue";

const watchlistStore = useWatchlistStore();

let draggedMovie = null;

const handleDragStart = (event, movie) => {
  draggedMovie = movie;
};

const handleDragOver = (event, movie) => {
  if (draggedMovie !== movie) {
    const draggedIndex = watchlistStore.watchlist.indexOf(draggedMovie);
    const targetIndex = watchlistStore.watchlist.indexOf(movie);

    const newWatchlist = [...watchlistStore.watchlist];
    newWatchlist.splice(draggedIndex, 1);
    newWatchlist.splice(targetIndex, 0, draggedMovie);

    watchlistStore.reorderWatchlist(newWatchlist);
  }
};

const handleDrop = () => {
  draggedMovie = null;
};

onBeforeMount(() => {
  document.title = "Watch List"
})

onMounted(() => {
  watchlistStore.loadFromLocalStorage();
});
</script>

<style scoped>
.undo-container {
  margin-bottom: 20px;
}

.undo-container button {
  padding: 5px 10px;
  background-color: #5830c5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>