import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseInput from '../BaseInput.vue';

describe('BaseInput', () => {
    it('link value to v-model', async () => {
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
});
