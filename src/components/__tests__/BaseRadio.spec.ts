import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseRadio from '../BaseRadio.vue';

describe('BaseRadio', () => {
    it('binds value to v-model', async () => {
        const wrapper = mount(BaseRadio, {
            props: {
                value: 'bar',
                modelValue: 'foo',
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('input');

        await element.setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bar']);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseRadio, {
            props: { value: 'foo' }
        });

        expect(wrapper.find('input').attributes('id')).toBeTruthy();
    });

    it('passes the value prop to the input', () => {
        const wrapper = mount(BaseRadio, {
            props: { value: 'foo' }
        });

        expect(wrapper.find('input').attributes('value')).toBe('foo');
    });

    it('passes native attributes through', () => {
        const wrapper = mount(BaseRadio, {
            props: { value: 'foo' },
            attrs: {
                disabled: true,
                class: 'my-radio'
            }
        });

        expect(wrapper.find('input').attributes('disabled')).toBeDefined();
        expect(wrapper.find('input').classes()).toContain('my-radio');
    });

    it('is checked when modelValue matches value', () => {
        const wrapper = mount(BaseRadio, {
            props: {
                value: 'foo',
                modelValue: 'foo'
            }
        });

        expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true);
    });

    it('is not checked when modelValue differs from value', () => {
        const wrapper = mount(BaseRadio, {
            props: {
                value: 'foo',
                modelValue: 'bar'
            }
        });

        expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false);
    });

    it('overrides auto-generated ID when attrs.id is provided', () => {
        const wrapper = mount(BaseRadio, {
            props: { value: 'foo' },
            attrs: { id: 'custom-radio' }
        });

        expect(wrapper.find('input').attributes('id')).toBe('custom-radio');
    });

    it('supports numeric value', async () => {
        const wrapper = mount(BaseRadio, {
            props: {
                value: 42,
                modelValue: 0,
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        await wrapper.find('input').setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42]);
    });
});
