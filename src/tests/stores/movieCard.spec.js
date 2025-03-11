import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import MovieCard from '../../components/MovieCard.vue';

describe('MovieCard', () => {
    let movie;

    beforeEach(() => {
        setActivePinia(createPinia());
        movie = {
            id: 1,
            title: 'Movie 1',
            poster_path: '/7iMBZzVZtG0oBug4TfqDb9ZxAOa.jpg',
            release_date: '2023-01-01',
        };
    });

    it('emits "add-to-watchlist" event when the button is clicked', async () => {
        const addToWatchlist = vi.fn();

        const wrapper = mount(MovieCard, {
            props: { movie },
            global: {
                mocks: {
                    addToWatchlist,
                },
            },
        });

        const button = wrapper.find('button');
        expect(button.exists()).toBe(true);

        await button.trigger('click');

        expect(addToWatchlist).toHaveBeenCalledTimes(1);
        expect(addToWatchlist).toHaveBeenCalledWith(movie);
    });

    it('shows the skeleton loader while the image is loading', () => {
        const wrapper = mount(MovieCard, {
            props: { movie },
            global: { plugins: [createPinia()] },
        });

        expect(wrapper.find('.skeleton-loader').exists()).toBe(true);
    });
});