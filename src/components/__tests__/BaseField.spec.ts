import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseField from '../BaseField.vue';
import BaseLabel from '../BaseLabel.vue';
import BaseInput from '../BaseInput.vue';
import BaseTextarea from '../BaseTextarea.vue';
import BaseSelect from '../BaseSelect.vue';
import BaseFile from '../BaseFile.vue';
import BaseCheckbox from '../BaseCheckbox.vue';
import BaseRadio from '../BaseRadio.vue';
import BaseCheckboxGroup from '../BaseCheckboxGroup.vue';
import BaseRadioGroup from '../BaseRadioGroup.vue';

describe('BaseField', () => {
    it('renders a div with slot content and attrs passthrough', () => {
        const wrapper = mount(BaseField, {
            attrs: {
                class: 'my-field'
            },
            slots: {
                default: 'Content'
            }
        });

        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.classes()).toContain('my-field');
        expect(wrapper.text()).toBe('Content');
    });

    it('uses an explicit id on CField for the label/input pairing instead of the wrapper', () => {
        const wrapper = mount(BaseField, {
            attrs: {
                id: 'custom-field'
            },
            slots: {
                default: [BaseLabel,
                    BaseInput]
            }
        });

        expect(wrapper.attributes('id')).toBeUndefined();
        expect(wrapper.find('label').attributes('for')).toBe('custom-field');
        expect(wrapper.find('input').attributes('id')).toBe('custom-field');
    });

    it('exposes invalid and message through the default scoped slot', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseInput },
            template: `
                <BaseField v-slot="{ invalid, message }">
                    <span :data-invalid="String(invalid)">{{ message }}</span>
                    <BaseInput required/>
                </BaseField>
            `
        });

        expect(wrapper.find('span').attributes('data-invalid')).toBe('false');
        expect(wrapper.find('span').text()).toBe('');

        const input = wrapper.find('input').element as HTMLInputElement;

        input.dispatchEvent(new Event('invalid'));
        await wrapper.vm.$nextTick();

        expect(wrapper.find('span').attributes('data-invalid')).toBe('true');
        expect(wrapper.find('span').text()).toBe(input.validationMessage);
    });

    it('links the label to the input via a shared id', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [BaseLabel,
                    BaseInput]
            }
        });

        const forAttribute = wrapper.find('label').attributes('for');

        expect(forAttribute).toBeTruthy();
        expect(wrapper.find('input').attributes('id')).toBe(forAttribute);
    });

    it.each([
        ['textarea',
            BaseTextarea],
        ['select',
            BaseSelect]
    ])('links the label to a %s via a shared id', (selector, component) => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [BaseLabel,
                    component]
            }
        });

        expect(wrapper.find(selector).attributes('id')).toBe(wrapper.find('label').attributes('for'));
    });

    it.each([
        ['file input',
            BaseFile],
        ['standalone checkbox',
            BaseCheckbox]
    ])('links the label to a %s via a shared id', (_, component) => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [BaseLabel,
                    component]
            }
        });

        expect(wrapper.find('input').attributes('id')).toBe(wrapper.find('label').attributes('for'));
    });

    it('links the label to a standalone radio via a shared id', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [
                    BaseLabel,
                    {
                        components: { BaseRadio },
                        template: '<BaseRadio value="foo"/>'
                    }
                ]
            }
        });

        expect(wrapper.find('input').attributes('id')).toBe(wrapper.find('label').attributes('for'));
    });

    it('lets an explicit id on the input win over the field id', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: {
                    components: { BaseInput },
                    template: '<BaseInput id="custom"/>'
                }
            }
        });

        expect(wrapper.find('input').attributes('id')).toBe('custom');
    });

    it('lets an explicit "for" on the label win over the field id', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: {
                    components: { BaseLabel },
                    template: '<BaseLabel for="custom"/>'
                }
            }
        });

        expect(wrapper.find('label').attributes('for')).toBe('custom');
    });

    it('does not apply the field id to checkboxes inside a group', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [
                    BaseLabel,
                    {
                        components: {
                            BaseCheckboxGroup,
                            BaseCheckbox
                        },
                        template: `
                            <BaseCheckboxGroup>
                                <BaseCheckbox value="a"/>
                                <BaseCheckbox value="b"/>
                            </BaseCheckboxGroup>
                        `
                    }
                ]
            }
        });

        const fieldId = wrapper.find('label').attributes('for');
        const ids = wrapper.findAll('input').map((input) => input.attributes('id'));

        expect(new Set(ids).size).toBe(2);
        expect(ids).not.toContain(fieldId);
    });

    it('links an item-level field label to a checkbox inside a group', () => {
        const wrapper = mount({
            components: {
                BaseCheckboxGroup,
                BaseField,
                BaseLabel,
                BaseCheckbox
            },
            template: `
                <BaseCheckboxGroup>
                    <BaseField>
                        <BaseLabel>Option A</BaseLabel>
                        <BaseCheckbox value="a"/>
                    </BaseField>
                </BaseCheckboxGroup>
            `
        });

        const forAttribute = wrapper.find('label').attributes('for');

        expect(forAttribute).toBeTruthy();
        expect(wrapper.find('input').attributes('id')).toBe(forAttribute);
    });

    it('links an item-level field label to a radio inside a group', () => {
        const wrapper = mount({
            components: {
                BaseRadioGroup,
                BaseField,
                BaseLabel,
                BaseRadio
            },
            template: `
                <BaseRadioGroup>
                    <BaseField>
                        <BaseLabel>Option A</BaseLabel>
                        <BaseRadio value="a"/>
                    </BaseField>
                </BaseRadioGroup>
            `
        });

        const forAttribute = wrapper.find('label').attributes('for');

        expect(forAttribute).toBeTruthy();
        expect(wrapper.find('input').attributes('id')).toBe(forAttribute);
    });

    it('does not apply the field id to radios inside a group', () => {
        const wrapper = mount(BaseField, {
            slots: {
                default: [
                    BaseLabel,
                    {
                        components: {
                            BaseRadioGroup,
                            BaseRadio
                        },
                        template: `
                            <BaseRadioGroup>
                                <BaseRadio value="a"/>
                                <BaseRadio value="b"/>
                            </BaseRadioGroup>
                        `
                    }
                ]
            }
        });

        const fieldId = wrapper.find('label').attributes('for');
        const ids = wrapper.findAll('input').map((input) => input.attributes('id'));

        expect(new Set(ids).size).toBe(2);
        expect(ids).not.toContain(fieldId);
    });
});
