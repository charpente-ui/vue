import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseCheckbox from '../BaseCheckbox.vue';

describe('BaseCheckbox', () => {
    it('link value to v-model', async () => {
        const wrapper = mount(BaseCheckbox, {
            props: {
                modelValue: 'foo',
                'onUpdate:modelValue': (e: string) => wrapper.setProps({
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

        await element.setChecked();

        expect(wrapper.emitted('update:modelValue')?.[0][0]).toContain('bar');
    });
});
