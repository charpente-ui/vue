import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseInput from '../BaseInput.vue';

describe('BaseInput', () => {
    it('binds value to v-model', async () => {
        let wrapper: ReturnType<typeof mount>;

        wrapper = mount(BaseInput, {
            props: {
                modelValue: 'foo',
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('input');

        await element.setValue('bar');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bar']);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseInput);

        expect(wrapper.find('input').attributes('id')).toBeDefined();
    });

    it('passes native attributes through', () => {
        const wrapper = mount(BaseInput, {
            attrs: {
                disabled: true,
                class: 'my-input'
            }
        });

        expect(wrapper.find('input').attributes('disabled')).toBeDefined();
        expect(wrapper.find('input').classes()).toContain('my-input');
    });

    it('overrides auto-generated ID when attrs.id is provided', () => {
        const wrapper = mount(BaseInput, {
            attrs: { id: 'custom-id' }
        });

        expect(wrapper.find('input').attributes('id')).toBe('custom-id');
    });

    it('supports numeric v-model', async () => {
        let wrapper: ReturnType<typeof mount>;

        wrapper = mount(BaseInput, {
            props: {
                modelValue: 42,
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('input');

        await element.setValue('99');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['99']);
    });

    it('handles rapid sequential updates', async () => {
        let wrapper: ReturnType<typeof mount>;

        wrapper = mount(BaseInput, {
            props: {
                modelValue: '',
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('input');

        await element.setValue('a');
        await element.setValue('ab');
        await element.setValue('abc');

        const emitted = wrapper.emitted('update:modelValue')!;

        expect(emitted).toHaveLength(3);
        expect(emitted[2]).toEqual(['abc']);
    });
});
