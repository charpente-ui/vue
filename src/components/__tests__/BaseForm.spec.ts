import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseForm from '../BaseForm.vue';

describe('BaseForm', () => {
    it('renders a <form> tag by default', () => {
        const wrapper = mount(BaseForm);

        expect(wrapper.element.tagName).toBe('FORM');
    });

    it('emits a "submit" event when submitted', async () => {
        const wrapper = mount(BaseForm);

        await wrapper.trigger('submit');

        expect(wrapper.emitted()).toHaveProperty('submit');
        expect(wrapper.emitted('submit')).toHaveLength(1);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseForm);

        expect(wrapper.find('form').attributes('id')).toBeDefined();
    });

    it('prevents default browser navigation on submit', async () => {
        const wrapper = mount(BaseForm);

        const event = new Event('submit', { bubbles: true, cancelable: true });
        await wrapper.find('form').element.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });

    it('renders slot content and inherits attributes', () => {
        const wrapper = mount(BaseForm, {
            slots: {
                default: '<p>Inside Form</p>'
            },
            attrs: {
                id: 'my-form',
                class: 'flex-col'
            }
        });

        expect(wrapper.html()).toContain('Inside Form');
        expect(wrapper.attributes('id')).toBe('my-form');
        expect(wrapper.classes()).toContain('flex-col');
    });
});
