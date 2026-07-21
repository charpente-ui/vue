import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseTextarea from '../BaseTextarea.vue';

describe('BaseTextarea', () => {
    it('binds value to v-model', async () => {
        const wrapper = mount(BaseTextarea, {
            props: {
                modelValue: 'foo',
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('textarea');

        await element.setValue('bar');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bar']);
    });

    it('renders without initial modelValue', () => {
        const wrapper = mount(BaseTextarea);

        expect(wrapper.find('textarea').exists()).toBe(true);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseTextarea);

        expect(wrapper.find('textarea').attributes('id')).toBeTruthy();
    });

    it('passes native attributes through', () => {
        const wrapper = mount(BaseTextarea, {
            attrs: {
                disabled: true,
                class: 'my-textarea'
            }
        });

        expect(wrapper.find('textarea').attributes('disabled')).toBeDefined();
        expect(wrapper.find('textarea').classes()).toContain('my-textarea');
    });

    it('overrides auto-generated ID when attrs.id is provided', () => {
        const wrapper = mount(BaseTextarea, {
            attrs: { id: 'custom-textarea' }
        });

        expect(wrapper.find('textarea').attributes('id')).toBe('custom-textarea');
    });

    it('handles rapid sequential updates', async () => {
        const wrapper = mount(BaseTextarea, {
            props: {
                modelValue: '',
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('textarea');

        await element.setValue('a');
        await element.setValue('ab');
        await element.setValue('abc');

        const emitted = wrapper.emitted('update:modelValue')!;

        expect(emitted).toHaveLength(3);
        expect(emitted[2]).toEqual(['abc']);
    });

    it('supports the trim modifier', async () => {
        const wrapper = mount(BaseTextarea, {
            props: {
                modelValue: '',
                modelModifiers: { trim: true },
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        await wrapper.find('textarea').setValue('  foo  ');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['foo']);
    });

    it('supports the lazy modifier', async () => {
        const wrapper = mount(BaseTextarea, {
            props: {
                modelValue: '',
                modelModifiers: { lazy: true },
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('textarea');

        element.element.value = 'foo';
        await element.trigger('input');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        await element.trigger('change');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['foo']);
    });
});
