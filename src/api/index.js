import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_APP_TOKEN}`,
    },
});

export default apiClient;