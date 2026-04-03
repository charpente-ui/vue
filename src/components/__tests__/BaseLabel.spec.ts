import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseLabel from '../BaseLabel.vue';

describe('BaseLabel', () => {
    it('renders slot content', () => {
        const wrapper = mount(BaseLabel, {
            slots: {
                default: 'Email'
            }
        });

        expect(wrapper.text()).toBe('Email');
    });

    it('sets the "for" attribute from props', () => {
        const wrapper = mount(BaseLabel, {
            props: {
                for: 'foo'
            }
        });

        expect(wrapper.attributes('for')).toBe('foo');
    });

    it('passes native attributes through', () => {
        const wrapper = mount(BaseLabel, {
            attrs: { class: 'my-label' }
        });

        expect(wrapper.classes()).toContain('my-label');
    });
});
