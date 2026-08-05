import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseSelect from '../BaseSelect.vue';

describe('BaseSelect', () => {
    it('binds value to v-model', async () => {
        const wrapper = mount(BaseSelect, {
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

    it('renders without initial modelValue', () => {
        const wrapper = mount(BaseSelect);

        expect(wrapper.find('select').exists()).toBe(true);
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
        const wrapper = mount(BaseSelect, {
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

        expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['foo',
            'baz']);
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

    it('renders options from the options prop', () => {
        const wrapper = mount(BaseSelect, {
            props: {
                options: [{
                    label: 'Foo',
                    value: 'foo'
                },
                {
                    label: 'Bar',
                    value: 'bar',
                    disabled: true
                }]
            }
        });

        const options = wrapper.findAll('option');

        expect(options).toHaveLength(2);
        expect(options[0].text()).toBe('Foo');
        expect(options[0].attributes('value')).toBe('foo');
        expect(options[1].attributes('disabled')).toBeDefined();
    });

    it('accepts plain strings and numbers as options', () => {
        const wrapper = mount(BaseSelect, {
            props: {
                options: ['foo',
                    42]
            }
        });

        const options = wrapper.findAll('option');

        expect(options[0].text()).toBe('foo');
        expect(options[1].text()).toBe('42');
        expect((options[1].element as HTMLOptionElement).value).toBe('42');
    });

    it('renders option groups', () => {
        const wrapper = mount(BaseSelect, {
            props: {
                options: [{
                    label: 'Group',
                    options: ['foo',
                        {
                            label: 'Bar',
                            value: 'bar'
                        }]
                },
                {
                    label: 'Disabled group',
                    disabled: true,
                    options: ['baz']
                }]
            }
        });

        const groups = wrapper.findAll('optgroup');

        expect(groups).toHaveLength(2);
        expect(groups[0].attributes('label')).toBe('Group');
        expect(groups[0].findAll('option')).toHaveLength(2);
        expect(groups[1].attributes('disabled')).toBeDefined();
    });

    it('renders the slot alongside the options prop', () => {
        const wrapper = mount(BaseSelect, {
            props: {
                options: ['foo']
            },
            slots: {
                default: '<option value="">Choose…</option>'
            }
        });

        const options = wrapper.findAll('option');

        expect(options).toHaveLength(2);
        expect(options[0].text()).toBe('Choose…');
        expect(options[1].text()).toBe('foo');
    });

    it('binds v-model to an option coming from the options prop', async () => {
        const wrapper = mount(BaseSelect, {
            props: {
                modelValue: 'foo',
                options: [{
                    label: 'Foo',
                    value: 'foo'
                },
                {
                    label: 'Bar',
                    value: 'bar'
                }]
            }
        });

        await wrapper.find('select').setValue('bar');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bar']);
    });

    it('keeps non-string option values intact', async () => {
        const wrapper = mount(BaseSelect, {
            props: {
                modelValue: 1,
                options: [{
                    label: 'One',
                    value: 1
                },
                {
                    label: 'Two',
                    value: 2
                }]
            }
        });

        const options = wrapper.findAll('option');

        (options[1].element as HTMLOptionElement).selected = true;
        await wrapper.find('select').trigger('change');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2]);
    });

    it('overrides auto-generated ID when attrs.id is provided', () => {
        const wrapper = mount(BaseSelect, {
            attrs: { id: 'custom-select' }
        });

        expect(wrapper.find('select').attributes('id')).toBe('custom-select');
    });
});
