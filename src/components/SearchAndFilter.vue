<template>
  <div class="search-wrapper">
    <div class="search-container">
      <input
          v-model="searchQuery"
          placeholder="Search movies..."
          @input="handleSearch"
      />
      <ul v-if="autocompleteResults.length" class="autocomplete-results">
        <li
            v-for="result in autocompleteResults"
            :key="result.id"
            @click="selectAutocompleteResult(result)"
        >
          {{ result.title }}
        </li>
      </ul>
    </div>

    <div class="genre-filter">
      <div class="dropdown-trigger" @click="toggleDropdown">
        Select Genres
        <span class="arrow">{{ isDropdownOpen ? '▲' : '▼' }}</span>
      </div>

      <div v-if="isDropdownOpen" class="dropdown-content">
        <label class="dropdown-item">
          <input
              type="checkbox"
              :checked="selectedGenres.length === 0"
              @change="handleAllGenresToggle"
          />
          All Genres
        </label>

        <label
            v-for="genre in genres"
            :key="genre.id"
            class="dropdown-item"
        >
          <input
              type="checkbox"
              :value="genre.id"
              v-model="selectedGenres"
              @change="handleGenreFilter"
          />
          {{ genre.name }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import { useMoviesStore } from '../stores/movies';
import {debounce} from "lodash";

const moviesStore = useMoviesStore();

const searchQuery = ref('');
const selectedGenres = ref([null]);
const isDropdownOpen = ref(false);
const autocompleteResults = computed(() => moviesStore.autocompleteResults);
const genres = computed(() => moviesStore.genres);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleAllGenresToggle = (event) => {
  if (event.target.checked) {
    selectedGenres.value = [];
    moviesStore.selectedGenre = [];
    moviesStore.fetchCombinedResults();
  }
};

const handleSearch = debounce(() => {
  moviesStore.searchQuery = searchQuery.value;
  moviesStore.fetchAutocompleteResults(searchQuery.value);
  moviesStore.fetchCombinedResults();
}, 300);

const selectAutocompleteResult = (result) => {
  searchQuery.value = result.title;
  moviesStore.searchQuery = result.title;
  moviesStore.autocompleteResults = [];
  moviesStore.fetchCombinedResults();
};

const handleGenreFilter = () => {
  moviesStore.selectedGenre = selectedGenres.value;
  moviesStore.fetchCombinedResults();
};

watch(selectedGenres, (newSelectedGenres) => {
  if (newSelectedGenres.length > 0) {
    selectedGenres.value = newSelectedGenres;
  }
});

watch(
    () => moviesStore.searchQuery,
    (newQuery) => {
      searchQuery.value = newQuery;
    }
);

watch(
    () => moviesStore.selectedGenre,
    (newGenres) => {
      selectedGenres.value = newGenres;
    }
);
</script>

<style scoped>
.search-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

@media (min-width: 768px) {
  .search-wrapper {
    flex-direction: row;
  }
}

.search-container {
  position: relative;
  flex: 1;
}

.search-container input {
  width: 100%;
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
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

.dropdown-trigger .arrow {
  margin-left: 10px;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  z-index: 1000;
  width: 200px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 5px;
}

.dropdown-item {
  display: block;
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-item input {
  margin-right: 10px;
}
</style>