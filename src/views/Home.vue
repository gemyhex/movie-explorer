<template>
  <div class="container">
    <h1>Movie Explorer</h1>

    <div v-if="moviesStore.error" class="error-message">
      {{ moviesStore.error }}
      <button @click="retryFailedRequest">Retry</button>
    </div>

    <SearchAndFilter />

    <div v-if="!moviesStore.loading">
      <div v-if="moviesStore.movies.length === 0" class="empty-state">
        No movies found. Try a different search or filter.
      </div>
      <div class="movie-grid" v-else>
        <MovieCard
            v-for="movie in moviesStore.movies"
            :key="movie.id"
            :movie="movie"
        />
      </div>
    </div>

    <Loader v-else></Loader>
  </div>
</template>

<script setup>
import {onBeforeMount, onMounted} from 'vue';
import { debounce } from 'lodash';
import MovieCard from '../components/MovieCard.vue';
import { useMoviesStore } from '../stores/movies';
import Loader from "../components/Loader.vue";
import SearchAndFilter from "../components/SearchAndFilter.vue";

const moviesStore = useMoviesStore();

const handleSearch = debounce(async () => {
  if (moviesStore.searchQuery) {
    await moviesStore.fetchAutocompleteResults(moviesStore.searchQuery);
  } else {
    moviesStore.autocompleteResults = [];
  }
  await moviesStore.fetchCombinedResults();
}, 300);

const handleGenreFilter = async () => {
  await moviesStore.fetchCombinedResults();
};

const selectAutocompleteResult = (result) => {
  moviesStore.searchQuery = result.title;
  moviesStore.autocompleteResults = [];
  moviesStore.fetchCombinedResults();
};

const retryFailedRequest = async () => {
  await moviesStore.fetchCombinedResults();
};

onBeforeMount(() => {
  document.title = "Movies List"
})

onMounted(async () => {
  await moviesStore.fetchPopularMovies();
  await moviesStore.fetchGenres();
});
</script>

<style scoped>
.search-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  width: 75%;
}

.search-container input {
  width: 100%;
  height: 36px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.autocomplete-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.autocomplete-results li {
  padding: 10px;
  cursor: pointer;
}

.autocomplete-results li:hover {
  background-color: #f0f0f0;
}

.genre-filter {
  width: 15%;
}

.genre-filter select {
  height: 36px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
</style>