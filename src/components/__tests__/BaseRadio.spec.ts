import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseRadio from '../BaseRadio.vue';

describe('BaseRadio', () => {
    it('link value to v-model', async () => {
        let wrapper: ReturnType<typeof mount>;

        wrapper = mount(BaseRadio, {
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

        expect(wrapper.find('input').attributes('id')).toBeDefined();
    });

    it('passes the value prop to the input', () => {
        const wrapper = mount(BaseRadio, {
            props: { value: 'foo' }
        });

        expect(wrapper.find('input').attributes('value')).toBe('foo');
    });
});
