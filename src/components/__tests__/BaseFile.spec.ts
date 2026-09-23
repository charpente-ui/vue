import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, it, expect } from 'vitest';
import BaseFile from '../BaseFile.vue';

// A real FileList can only come from a DataTransfer, which jsdom lacks. Borrowing
// its prototype keeps Vue from wrapping the list in a reactive proxy, which it
// never does to the real one — a plain array would be, and would no longer be
// the list the input holds.
function fileList(...files: File[]): FileList {
    return Object.defineProperty(Object.assign(Object.create(FileList.prototype), files), 'length', {
        value: files.length
    });
}

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

        const file = new File([
            'content'
        ], 'test.txt', {
            type: 'text/plain'
        });

        const input = wrapper.find('input').element as HTMLInputElement;

        Object.defineProperty(input, 'files', {
            value: fileList(file),
            configurable: true
        });

        await wrapper.find('input').trigger('change');

        const emitted = wrapper.emitted('update:modelValue');

        expect(emitted).toBeTruthy();
        expect((emitted![0][0] as ArrayLike<File>)[0]).toBe(file);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseFile);

        expect(wrapper.find('input').attributes('id')).toBeTruthy();
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

    it('writes a list set by the app into the input', async () => {
        const wrapper = mount(BaseFile, {
            props: {
                modelValue: null
            }
        });

        const input = wrapper.find('input').element as HTMLInputElement;
        const list = fileList(new File([
            'content'
        ], 'test.txt'));
        let written: FileList | null = null;

        Object.defineProperty(input, 'files', {
            get: () => written,
            set: (value: FileList) => {
                written = value;
            },
            configurable: true
        });

        await wrapper.setProps({
            modelValue: list
        });

        expect(input.files).toBe(list);
    });

    it('does not write back the list the input already holds', async () => {
        const wrapper = mount(BaseFile, {
            props: {
                modelValue: null
            }
        });

        const input = wrapper.find('input').element as HTMLInputElement;
        const list = fileList();
        let writes = 0;

        Object.defineProperty(input, 'files', {
            get: () => list,
            set: () => {
                writes++;
            },
            configurable: true
        });

        await wrapper.setProps({
            modelValue: list
        });

        expect(writes).toBe(0);
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

    it('passes accept attribute through', () => {
        const wrapper = mount(BaseFile, {
            attrs: { accept: 'image/*' }
        });

        expect(wrapper.find('input').attributes('accept')).toBe('image/*');
    });

    it('passes multiple attribute through', () => {
        const wrapper = mount(BaseFile, {
            attrs: { multiple: true }
        });

        expect(wrapper.find('input').attributes('multiple')).toBeDefined();
    });
});
