import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseInput from '../BaseInput.vue';

describe('BaseInput', () => {
    it('binds value to v-model', async () => {
        const wrapper = mount(BaseInput, {
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

    it('renders without initial modelValue', () => {
        const wrapper = mount(BaseInput);

        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseInput);

        expect(wrapper.find('input').attributes('id')).toBeTruthy();
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
        const wrapper = mount(BaseInput, {
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

    it('forwards native input event via $attrs', async () => {
        let called = false;
        const wrapper = mount(BaseInput, {
            attrs: { onInput: () => {
                called = true; 
            } }
        });

        await wrapper.find('input').trigger('input');

        expect(called).toBe(true);
    });

    it('forwards native change event via $attrs', async () => {
        let called = false;
        const wrapper = mount(BaseInput, {
            attrs: { onChange: () => {
                called = true; 
            } }
        });

        await wrapper.find('input').trigger('change');

        expect(called).toBe(true);
    });

    it('handles rapid sequential updates', async () => {
        const wrapper = mount(BaseInput, {
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

    it('supports the trim modifier', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: '',
                modelModifiers: { trim: true },
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        await wrapper.find('input').setValue('  foo  ');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['foo']);
    });

    it('supports the number modifier', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: '',
                modelModifiers: { number: true },
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('input');

        await element.setValue('42.5');
        await element.setValue('abc');

        const emitted = wrapper.emitted('update:modelValue')!;

        expect(emitted[0]).toEqual([42.5]);
        expect(emitted[1]).toEqual(['abc']);
    });

    it('supports the lazy modifier', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: '',
                modelModifiers: { lazy: true },
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('input');

        element.element.value = 'foo';
        await element.trigger('input');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        await element.trigger('change');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['foo']);
    });
});
