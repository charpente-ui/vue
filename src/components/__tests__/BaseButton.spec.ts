import { mount } from '@vue/test-utils';
import { defineComponent, markRaw } from 'vue';
import { describe, it, expect } from 'vitest';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
    it('renders button with slot content', () => {
        const wrapper = mount(BaseButton, {
            slots: {
                default: 'Envoyer'
            }
        });

        expect(wrapper.text()).toBe('Envoyer');
        expect(wrapper.element.tagName).toBe('BUTTON');
    });

    it('renders as a different tag via the "as" prop', () => {
        const wrapper = mount(BaseButton, {
            props: { as: 'a' },
            attrs: { href: '#' },
            slots: { default: 'Lien' }
        });

        expect(wrapper.element.tagName).toBe('A');
    });

    it('renders as a Vue component via the "as" prop', () => {
        const CustomComponent = markRaw(defineComponent({
            template: '<span><slot /></span>'
        }));

        const wrapper = mount(BaseButton, {
            props: { as: CustomComponent },
            slots: { default: 'Custom' }
        });

        expect(wrapper.element.tagName).toBe('SPAN');
        expect(wrapper.text()).toBe('Custom');
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
