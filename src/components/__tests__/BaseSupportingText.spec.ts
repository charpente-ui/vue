import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, it, expect } from 'vitest';
import BaseField from '../BaseField.vue';
import BaseForm from '../BaseForm.vue';
import BaseSupportingText from '../BaseSupportingText.vue';
import BaseInput from '../BaseInput.vue';
import BaseSelect from '../BaseSelect.vue';
import BaseCheckbox from '../BaseCheckbox.vue';

describe('BaseSupportingText', () => {
    it('renders a paragraph with slot content and attrs passthrough', () => {
        const wrapper = mount(BaseSupportingText, {
            attrs: {
                class: 'my-text'
            },
            slots: {
                default: 'Helpful hint'
            }
        });

        expect(wrapper.element.tagName).toBe('P');
        expect(wrapper.classes()).toContain('my-text');
        expect(wrapper.text()).toBe('Helpful hint');
        expect(wrapper.attributes('id')).toBeTruthy();

        wrapper.unmount();
    });

    it('wires the control aria-describedby to the text id inside a field', async () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [BaseInput,
                    BaseSupportingText]
            }
        });

        await nextTick();

        const textId = wrapper.find('p').attributes('id');

        expect(textId).toBeTruthy();
        expect(wrapper.find('input').attributes('aria-describedby')).toBe(textId);
    });

    it.each([
        ['select',
            BaseSelect,
            'select'],
        ['checkbox',
            BaseCheckbox,
            'input']
    ])('wires aria-describedby on a %s', async (_, component, selector) => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [component,
                    BaseSupportingText]
            }
        });

        await nextTick();

        expect(wrapper.find(selector).attributes('aria-describedby')).toBe(wrapper.find('p').attributes('id'));
    });

    it('lets an explicit id on the text win', async () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [
                    BaseInput,
                    {
                        components: { BaseSupportingText },
                        template: '<BaseSupportingText id="hint"/>'
                    }
                ]
            }
        });

        await nextTick();

        expect(wrapper.find('p').attributes('id')).toBe('hint');
        expect(wrapper.find('input').attributes('aria-describedby')).toBe('hint');
    });

    it('lets an explicit aria-describedby on the control win', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [
                    {
                        components: { BaseInput },
                        template: '<BaseInput aria-describedby="custom"/>'
                    },
                    BaseSupportingText
                ]
            }
        });

        expect(wrapper.find('input').attributes('aria-describedby')).toBe('custom');
    });

    it('does not set aria-describedby without a supporting text', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [BaseInput]
            }
        });

        expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined();
    });

    it('clears the wiring when the text unmounts', async () => {
        const wrapper = mount({
            components: {
                BaseField,
                BaseInput,
                BaseSupportingText
            },
            data: () => ({ show: true }),
            template: `
                <BaseField>
                    <BaseInput/>
                    <BaseSupportingText v-if="show">Hint</BaseSupportingText>
                </BaseField>
            `
        });

        await nextTick();

        expect(wrapper.find('input').attributes('aria-describedby')).toBeTruthy();

        await wrapper.setData({ show: false });

        expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined();
    });

    it('shows the native validation message after a failed submit and clears it once fixed', async () => {
        const wrapper = mount({
            components: {
                BaseForm,
                BaseField,
                BaseInput,
                BaseSupportingText
            },
            template: `
                <BaseForm validate>
                    <BaseField>
                        <BaseInput required/>
                        <BaseSupportingText validation>Hint</BaseSupportingText>
                    </BaseField>
                </BaseForm>
            `
        });

        const input = wrapper.find('input');
        const text = wrapper.find('p');

        // Typing before any submit attempt must not surface an error.
        await input.setValue('a');
        await input.setValue('');

        expect(text.text()).toBe('Hint');
        expect(input.attributes('aria-invalid')).toBeUndefined();

        await wrapper.find('form').trigger('submit');

        expect(text.text()).not.toBe('Hint');
        expect(text.text()).toBeTruthy();
        expect(input.attributes('aria-invalid')).toBe('true');

        await input.setValue('fixed');

        expect(text.text()).toBe('Hint');
        expect(input.attributes('aria-invalid')).toBeUndefined();
    });

    it('renders the slot when validation is set outside a field', () => {
        const wrapper = mount(BaseSupportingText, {
            props: {
                validation: true
            },
            slots: {
                default: 'Hint'
            }
        });

        expect(wrapper.text()).toBe('Hint');
    });

    it('lets an explicit aria-invalid on the control win', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: {
                    components: { BaseInput },
                    template: '<BaseInput aria-invalid="false"/>'
                }
            }
        });

        expect(wrapper.find('input').attributes('aria-invalid')).toBe('false');
    });
});
