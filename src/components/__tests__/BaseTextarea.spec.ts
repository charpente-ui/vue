import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseTextarea from '../BaseTextarea.vue';

describe('BaseTextarea', () => {
    it('link value to v-model', async () => {
        const wrapper = mount(BaseTextarea, {
            props: {
                modelValue: 'foo',
                'onUpdate:modelValue': (e: string) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const element = wrapper.find('textarea');

        await element.setValue('bar');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bar']);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseTextarea);

        expect(wrapper.find('textarea').attributes('id')).toBeDefined();
    });
});
