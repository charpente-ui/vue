import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import BaseRadioGroup from '../BaseRadioGroup.vue';
import BaseRadio from '../BaseRadio.vue';
import BaseField from '../BaseField.vue';
import BaseSupportingText from '../BaseSupportingText.vue';

describe('BaseRadioGroup', () => {
    it('renders a fieldset with slot content', () => {
        const wrapper = mount(BaseRadioGroup, {
            slots: {
                default: '<span class="child">child</span>'
            }
        });

        expect(wrapper.find('fieldset').exists()).toBe(true);
        expect(wrapper.find('.child').exists()).toBe(true);
    });

    it('shares the v-model with child radios', async () => {
        const wrapper = mount({
            components: { BaseRadioGroup,
                BaseRadio },
            data: () => ({ value: 'a' }),
            template: `
                <BaseRadioGroup v-model="value">
                    <BaseRadio value="a"/>
                    <BaseRadio value="b"/>
                </BaseRadioGroup>
            `
        });

        const inputs = wrapper.findAll('input');

        expect((inputs[0].element as HTMLInputElement).checked).toBe(true);
        expect((inputs[1].element as HTMLInputElement).checked).toBe(false);

        await inputs[1].setValue(true);

        expect(wrapper.vm.value).toBe('b');
    });

    it('shares an auto-generated name across child radios', () => {
        const wrapper = mount({
            components: { BaseRadioGroup,
                BaseRadio },
            template: `
                <BaseRadioGroup>
                    <BaseRadio value="a"/>
                    <BaseRadio value="b"/>
                </BaseRadioGroup>
            `
        });

        const inputs = wrapper.findAll('input');
        const nameA = inputs[0].attributes('name');
        const nameB = inputs[1].attributes('name');

        expect(nameA).toBeTruthy();
        expect(nameA).toBe(nameB);
    });

    it('uses a custom name attribute when provided', () => {
        const wrapper = mount({
            components: { BaseRadioGroup,
                BaseRadio },
            template: `
                <BaseRadioGroup name="custom-group">
                    <BaseRadio value="a"/>
                    <BaseRadio value="b"/>
                </BaseRadioGroup>
            `
        });

        const inputs = wrapper.findAll('input');

        expect(inputs[0].attributes('name')).toBe('custom-group');
        expect(inputs[1].attributes('name')).toBe('custom-group');
    });

    it('lets a child radio override the group name via attrs', () => {
        const wrapper = mount({
            components: { BaseRadioGroup,
                BaseRadio },
            template: `
                <BaseRadioGroup name="group-name">
                    <BaseRadio value="a" name="override"/>
                    <BaseRadio value="b"/>
                </BaseRadioGroup>
            `
        });

        const inputs = wrapper.findAll('input');

        expect(inputs[0].attributes('name')).toBe('override');
        expect(inputs[1].attributes('name')).toBe('group-name');
    });

    it('passes native attributes through to the fieldset', () => {
        const wrapper = mount(BaseRadioGroup, {
            attrs: {
                disabled: true,
                class: 'my-group'
            }
        });

        const fieldset = wrapper.find('fieldset');

        expect(fieldset.attributes('disabled')).toBeDefined();
        expect(fieldset.classes()).toContain('my-group');
    });

    it('describes the fieldset with the supporting texts of a wrapping field', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseRadioGroup,
                BaseRadio,
                BaseSupportingText },
            template: `
                <BaseField>
                    <BaseRadioGroup>
                        <BaseRadio value="a"/>
                    </BaseRadioGroup>
                    <BaseSupportingText>Pick one</BaseSupportingText>
                </BaseField>
            `
        });

        await nextTick();

        const hintId = wrapper.find('p').attributes('id');

        expect(wrapper.find('fieldset').attributes('aria-describedby')).toBe(hintId);
    });

    it('registers a supporting text written inside the group', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseRadioGroup,
                BaseRadio,
                BaseSupportingText },
            template: `
                <BaseField>
                    <BaseRadioGroup>
                        <BaseRadio value="a"/>
                        <BaseSupportingText>Pick one</BaseSupportingText>
                    </BaseRadioGroup>
                </BaseField>
            `
        });

        await nextTick();

        const hintId = wrapper.find('p').attributes('id');

        expect(hintId).toBeTruthy();
        expect(wrapper.find('fieldset').attributes('aria-describedby')).toBe(hintId);
    });

    it('keeps the description and the id off the individual radios', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseRadioGroup,
                BaseRadio,
                BaseSupportingText },
            template: `
                <BaseField>
                    <BaseRadioGroup>
                        <BaseRadio value="a"/>
                        <BaseRadio value="b"/>
                    </BaseRadioGroup>
                    <BaseSupportingText>Pick one</BaseSupportingText>
                </BaseField>
            `
        });

        await nextTick();

        const inputs = wrapper.findAll('input');
        const fieldId = wrapper.find('fieldset').attributes('aria-describedby');

        expect(inputs[0].attributes('aria-describedby')).toBeUndefined();
        expect(inputs[1].attributes('aria-describedby')).toBeUndefined();
        expect(inputs[0].attributes('id')).not.toBe(inputs[1].attributes('id'));
        expect(fieldId).toBeTruthy();
    });

    it('flags the fieldset invalid and leaves the radios untouched', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseRadioGroup,
                BaseRadio },
            template: `
                <BaseField>
                    <BaseRadioGroup>
                        <BaseRadio value="a"/>
                    </BaseRadioGroup>
                </BaseField>
            `
        });

        const input = wrapper.find('input');

        input.element.setCustomValidity('Required');
        await input.trigger('invalid');

        expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-invalid')).toBeUndefined();
    });

    it('lets an explicit aria-describedby on the group win', () => {
        const wrapper = mount({
            components: { BaseField,
                BaseRadioGroup,
                BaseRadio,
                BaseSupportingText },
            template: `
                <BaseField>
                    <BaseRadioGroup aria-describedby="custom">
                        <BaseRadio value="a"/>
                    </BaseRadioGroup>
                    <BaseSupportingText>Pick one</BaseSupportingText>
                </BaseField>
            `
        });

        expect(wrapper.find('fieldset').attributes('aria-describedby')).toBe('custom');
    });

    it('lets an explicit aria-invalid on the group win', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseRadioGroup,
                BaseRadio },
            template: `
                <BaseField>
                    <BaseRadioGroup aria-invalid="false">
                        <BaseRadio value="a"/>
                    </BaseRadioGroup>
                </BaseField>
            `
        });

        const input = wrapper.find('input');

        input.element.setCustomValidity('Required');
        await input.trigger('invalid');

        expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('false');
    });

    it('adds no aria wiring without a wrapping field', () => {
        const wrapper = mount({
            components: { BaseRadioGroup,
                BaseRadio },
            template: `
                <BaseRadioGroup>
                    <BaseRadio value="a"/>
                </BaseRadioGroup>
            `
        });

        const fieldset = wrapper.find('fieldset');

        expect(fieldset.attributes('aria-describedby')).toBeUndefined();
        expect(fieldset.attributes('aria-invalid')).toBeUndefined();
    });

    it('falls back to standalone v-model when used outside a group', async () => {
        const wrapper = mount(BaseRadio, {
            props: {
                value: 'foo',
                modelValue: '',
                'onUpdate:modelValue': (e: unknown) => wrapper.setProps({
                    modelValue: e
                })
            }
        });

        await wrapper.find('input').setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['foo']);
    });
});
