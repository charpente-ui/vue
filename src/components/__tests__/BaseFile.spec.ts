import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, it, expect } from 'vitest';
import BaseFile from '../BaseFile.vue';

describe('BaseFile', () => {
    it('updates model with FileList on change', async () => {
        const wrapper = mount(BaseFile, {
            props: {
                modelValue: null,
                'onUpdate:modelValue': (e: FileList | null) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const file = new File(['content'], 'test.txt', {
            type: 'text/plain'
        });

        const input = wrapper.find('input').element as HTMLInputElement;

        Object.defineProperty(input, 'files', {
            value: [file],
            configurable: true
        });

        await wrapper.find('input').trigger('change');

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect((emitted![0][0] as ArrayLike<File>)[0]).toBe(file);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseFile);

        expect(wrapper.find('input').attributes('id')).toBeDefined();
    });

    it('has type="file"', () => {
        const wrapper = mount(BaseFile);

        expect(wrapper.find('input').attributes('type')).toBe('file');
    });

    it('clears the input when model is set to null', async () => {
        const wrapper = mount(BaseFile, {
            props: {
                modelValue: {} as FileList,
                'onUpdate:modelValue': (e: FileList | null) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        const input = wrapper.find('input').element as HTMLInputElement;
        Object.defineProperty(input, 'value', {
            value: 'C:\\fakepath\\test.txt',
            writable: true,
            configurable: true
        });

        await wrapper.setProps({
            modelValue: null
        });

        await nextTick();

        expect(input.value).toBe('');
    });

    it('passes native attributes through', () => {
        const wrapper = mount(BaseFile, {
            attrs: {
                disabled: true,
                class: 'my-file'
            }
        });

        expect(wrapper.find('input').attributes('disabled')).toBeDefined();
        expect(wrapper.find('input').classes()).toContain('my-file');
    });

    it('overrides auto-generated ID when attrs.id is provided', () => {
        const wrapper = mount(BaseFile, {
            attrs: { id: 'custom-file' }
        });

        expect(wrapper.find('input').attributes('id')).toBe('custom-file');
    });
});
