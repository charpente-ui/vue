import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
    it('need to render button with this content', () => {
        const wrapper = mount(BaseButton, {
            slots: {
                default: 'Envoyer'
            }
        });

        expect(wrapper.text()).toBe('Envoyer');
        expect(wrapper.element.tagName).toBe('BUTTON');
    });

    it('need change this balise with "as" prop', () => {
        const wrapper = mount(BaseButton, {
            props: {
                as: 'a',
                href: '#'
            },
            slots: {
                default: 'Lien'
            }
        });

        expect(wrapper.element.tagName).toBe('A');
    });

    it('passes native attributes through', () => {
        const wrapper = mount(BaseButton, {
            attrs: {
                disabled: true,
                class: 'my-button'
            }
        });

        expect(wrapper.attributes('disabled')).toBeDefined();
        expect(wrapper.classes()).toContain('my-button');
    });

    it('forwards click events', async () => {
        const wrapper = mount(BaseButton);

        await wrapper.trigger('click');

        expect(wrapper.emitted('click')).toHaveLength(1);
    });
});
