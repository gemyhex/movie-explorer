import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import VueLazyload from 'vue-lazyload';
import './assets/styles.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(VueLazyload, {
    attempt: 3, // Number of attempts to load the image
});
app.mount('#app');