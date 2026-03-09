import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseSelect from '../BaseSelect.vue';

describe('BaseSelect', () => {
    it('link value to v-model', async () => {
        let wrapper: ReturnType<typeof mount>;

        wrapper = mount(BaseSelect, {
            props: {
                modelValue: 'foo',
                'onUpdate:modelValue': (e: string | number) => wrapper.setProps({
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

        expect(wrapper.find('select').attributes('id')).toBeDefined();
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
});
