<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div>
    <nav class="navbar">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/watchlist" class="nav-link">Watchlist</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<style>
.navbar {
  background-color: #5830c5;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.2);
}
</style>