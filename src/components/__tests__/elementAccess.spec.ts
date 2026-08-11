import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { Component } from 'vue';
import BaseCheckbox from '../BaseCheckbox.vue';
import BaseCheckboxGroup from '../BaseCheckboxGroup.vue';
import BaseField from '../BaseField.vue';
import BaseFile from '../BaseFile.vue';
import BaseForm from '../BaseForm.vue';
import BaseInput from '../BaseInput.vue';
import BaseLabel from '../BaseLabel.vue';
import BaseRadio from '../BaseRadio.vue';
import BaseRadioGroup from '../BaseRadioGroup.vue';
import BaseSelect from '../BaseSelect.vue';
import BaseSupportingText from '../BaseSupportingText.vue';
import BaseTextarea from '../BaseTextarea.vue';

// Every component renders one native element and hands it back under the same
// name, so a ref on any of them reaches the DOM the same way. `el` is the
// documented surface: `$el` also works but is Vue's own untyped internal.
const components: [string, Component, string, Record<string, unknown>][] = [
    ['CInput',
        BaseInput,
        'INPUT',
        {}],
    ['CTextarea',
        BaseTextarea,
        'TEXTAREA',
        {}],
    ['CSelect',
        BaseSelect,
        'SELECT',
        {}],
    ['CCheckbox',
        BaseCheckbox,
        'INPUT',
        {}],
    ['CRadio',
        BaseRadio,
        'INPUT',
        { value: 'a' }],
    ['CFile',
        BaseFile,
        'INPUT',
        {}],
    ['CForm',
        BaseForm,
        'FORM',
        {}],
    ['CField',
        BaseField,
        'DIV',
        {}],
    ['CLabel',
        BaseLabel,
        'LABEL',
        {}],
    ['CSupportingText',
        BaseSupportingText,
        'P',
        {}],
    ['CCheckboxGroup',
        BaseCheckboxGroup,
        'FIELDSET',
        {}],
    ['CRadioGroup',
        BaseRadioGroup,
        'FIELDSET',
        {}]
];

describe('element access', () => {
    it.each(components)('%s exposes its native element', (_name, component, tag, props) => {
        const wrapper = mount(component, { props });
        const el = (wrapper.vm as unknown as { el: HTMLElement | null }).el;

        expect(el).toBeInstanceOf(HTMLElement);
        expect(el?.tagName).toBe(tag);
        expect(el).toBe(wrapper.element);
    });

    it('gives an input that can be focused from the outside', () => {
        const wrapper = mount(BaseInput, { attachTo: document.body });
        const el = (wrapper.vm as unknown as { el: HTMLInputElement | null }).el;

        el?.focus();

        expect(document.activeElement).toBe(el);

        wrapper.unmount();
    });

    it('gives a form that can be reset from the outside', async () => {
        const wrapper = mount(BaseForm, {
            slots: {
                default: '<input name="name" value=""/>'
            }
        });
        const el = (wrapper.vm as unknown as { el: HTMLFormElement | null }).el;
        const input = wrapper.find('input');

        await input.setValue('typed');
        expect(input.element.value).toBe('typed');

        el?.reset();

        expect(input.element.value).toBe('');
    });
});
