import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Watchlist from '../views/Watchlist.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/watchlist', component: Watchlist },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;