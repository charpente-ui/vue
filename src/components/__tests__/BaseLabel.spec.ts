import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, it, expect } from 'vitest';
import BaseLabel from '../BaseLabel.vue';
import BaseField from '../BaseField.vue';
import BaseInput from '../BaseInput.vue';

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

    it('renders without a "for" attribute when prop is not set', () => {
        const wrapper = mount(BaseLabel);

        expect(wrapper.attributes('for')).toBeUndefined();
    });

    // `for=""` is not an override, it is an absent id: falling back to the
    // field is what keeps the label wired to its control.
    it('falls back to the field id when "for" is an empty string', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: () => [
                    h(BaseLabel, { for: '' }, () => 'Name'),
                    h(BaseInput)
                ]
            }
        });

        const labelFor = wrapper.find('label').attributes('for');

        expect(labelFor).toBeTruthy();
        expect(labelFor).toBe(wrapper.find('input').attributes('id'));
    });

    it('renders with an empty slot', () => {
        const wrapper = mount(BaseLabel);

        expect(wrapper.element.tagName).toBe('LABEL');
        expect(wrapper.text()).toBe('');
    });
});
