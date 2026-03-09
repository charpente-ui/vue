import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import BaseCheckbox from '../BaseCheckbox.vue';

describe('BaseCheckbox', () => {
    it('link value to v-model', async () => {
        let wrapper: ReturnType<typeof mount>;

        wrapper = mount(BaseCheckbox, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': (e: boolean | (string | number)[]) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('input');

        await element.setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseCheckbox);

        expect(wrapper.find('input').attributes('id')).toBeDefined();
    });

    it('adds a value to the array in grouped mode', async () => {
        const wrapper = mount(BaseCheckbox, {
            props: {
                modelValue: [
                    'foo'
                ],
                value: 'bar'
            }
        });

        const element = wrapper.find('input');

        await element.setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0][0]).toContain('bar');
    });

    it('sets indeterminate state on the input element', async () => {
        const wrapper = mount(BaseCheckbox, {
            props: {
                indeterminate: true
            }
        });

        await nextTick();

        const input = wrapper.find('input').element as HTMLInputElement;

        expect(input.indeterminate).toBe(true);
    });

    it('reacts to indeterminate prop changes', async () => {
        const wrapper = mount(BaseCheckbox, {
            props: {
                indeterminate: false
            }
        });

        const input = wrapper.find('input').element as HTMLInputElement;

        expect(input.indeterminate).toBe(false);

        await wrapper.setProps({
            indeterminate: true
        });

        expect(input.indeterminate).toBe(true);
    });

    it('passes native attributes through', () => {
        const wrapper = mount(BaseCheckbox, {
            attrs: {
                disabled: true,
                class: 'my-checkbox'
            }
        });

        expect(wrapper.find('input').attributes('disabled')).toBeDefined();
        expect(wrapper.find('input').classes()).toContain('my-checkbox');
    });
});
