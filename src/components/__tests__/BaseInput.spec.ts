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

    // Trimming the model must not trim what the user is typing: writing the
    // trimmed value back into the field ate the space under the cursor, and
    // `Jean Dupont` came out as `JeanDupont`.
    it('leaves the typed value in the field while the trim modifier shortens the model', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: '',
                modelModifiers: { trim: true },
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const input = wrapper.find('input');

        input.element.value = 'Jean ';
        await input.trigger('input');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Jean']);
        expect(input.element.value).toBe('Jean ');

        input.element.value = 'Jean Dupont';
        await input.trigger('input');

        expect(input.element.value).toBe('Jean Dupont');
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['Jean Dupont']);
    });

    // What Vue's own directive does on `change`: the value left behind is the
    // value the app holds.
    it('normalizes the field itself once the user leaves it', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: '',
                modelModifiers: { trim: true },
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const input = wrapper.find('input');

        input.element.value = '  foo  ';
        await input.trigger('input');
        await input.trigger('change');

        expect(input.element.value).toBe('foo');
        expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
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
