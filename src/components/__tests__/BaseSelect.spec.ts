import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseSelect from '../BaseSelect.vue';

describe('BaseSelect', () => {
    it('binds value to v-model', async () => {
        let wrapper: ReturnType<typeof mount>;

        wrapper = mount(BaseSelect, {
            props: {
                modelValue: 'foo',
                'onUpdate:modelValue': (e: string | number | (string | number)[]) => wrapper.setProps({
                    modelValue: e
                })
            },
            slots: {
                default: `
          <option value="foo">Foo</option>
          <option value="bar">Bar</option>
        `
            }
        });

        const element = wrapper.find('select');

        await element.setValue('bar');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bar']);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseSelect);

        expect(wrapper.find('select').attributes('id')).toBeTruthy();
    });

    it('renders a multiple select when multiple attr is set', () => {
        const wrapper = mount(BaseSelect, {
            attrs: {
                multiple: true
            },
            props: {
                modelValue: []
            },
            slots: {
                default: `
          <option value="foo">Foo</option>
          <option value="bar">Bar</option>
        `
            }
        });

        expect(wrapper.find('select').attributes('multiple')).toBeDefined();
    });

    it('supports array v-model in multiple mode', async () => {
        let wrapper: ReturnType<typeof mount>;

        wrapper = mount(BaseSelect, {
            attrs: {
                multiple: true
            },
            props: {
                modelValue: [],
                'onUpdate:modelValue': (e: string | number | (string | number)[]) => wrapper.setProps({
                    modelValue: e
                })
            },
            slots: {
                default: `
          <option value="foo">Foo</option>
          <option value="bar">Bar</option>
          <option value="baz">Baz</option>
        `
            }
        });

        const options = wrapper.findAll('option');

        (options[0].element as HTMLOptionElement).selected = true;
        (options[2].element as HTMLOptionElement).selected = true;
        await wrapper.find('select').trigger('change');

        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['foo', 'baz']);
    });

    it('passes native attributes through', () => {
        const wrapper = mount(BaseSelect, {
            attrs: {
                disabled: true,
                class: 'my-select'
            }
        });

        expect(wrapper.find('select').attributes('disabled')).toBeDefined();
        expect(wrapper.find('select').classes()).toContain('my-select');
    });

    it('overrides auto-generated ID when attrs.id is provided', () => {
        const wrapper = mount(BaseSelect, {
            attrs: { id: 'custom-select' }
        });

        expect(wrapper.find('select').attributes('id')).toBe('custom-select');
    });
});
