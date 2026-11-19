import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import BaseCheckboxGroup from '../BaseCheckboxGroup.vue';
import BaseCheckbox from '../BaseCheckbox.vue';
import BaseField from '../BaseField.vue';
import BaseSupportingText from '../BaseSupportingText.vue';

describe('BaseCheckboxGroup', () => {
    it('renders a fieldset with slot content', () => {
        const wrapper = mount(BaseCheckboxGroup, {
            slots: {
                default: '<span class="child">child</span>'
            }
        });

        expect(wrapper.find('fieldset').exists()).toBe(true);
        expect(wrapper.find('.child').exists()).toBe(true);
    });

    it('shares the v-model array with child checkboxes', async () => {
        const wrapper = mount({
            components: { BaseCheckboxGroup,
                BaseCheckbox },
            data: () => ({ values: [
                'a'
            ] }),
            template: `
                <BaseCheckboxGroup v-model="values">
                    <BaseCheckbox value="a"/>
                    <BaseCheckbox value="b"/>
                </BaseCheckboxGroup>
            `
        });

        const inputs = wrapper.findAll('input');

        expect((inputs[0].element as HTMLInputElement).checked).toBe(true);
        expect((inputs[1].element as HTMLInputElement).checked).toBe(false);

        await inputs[1].setValue(true);

        expect(wrapper.vm.values).toContain('b');
    });

    it('unchecking removes the value from the array', async () => {
        const wrapper = mount({
            components: { BaseCheckboxGroup,
                BaseCheckbox },
            data: () => ({ values: [
                'a',
                'b'
            ] }),
            template: `
                <BaseCheckboxGroup v-model="values">
                    <BaseCheckbox value="a"/>
                    <BaseCheckbox value="b"/>
                </BaseCheckboxGroup>
            `
        });

        await wrapper.findAll('input')[0].setValue(false);

        expect(wrapper.vm.values).not.toContain('a');
        expect(wrapper.vm.values).toContain('b');
    });

    it('defaults to an empty array when no modelValue is provided', () => {
        const wrapper = mount({
            components: { BaseCheckboxGroup,
                BaseCheckbox },
            template: `
                <BaseCheckboxGroup>
                    <BaseCheckbox value="a"/>
                </BaseCheckboxGroup>
            `
        });

        expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false);
    });

    it('passes native attributes through to the fieldset', () => {
        const wrapper = mount(BaseCheckboxGroup, {
            attrs: {
                disabled: true,
                class: 'my-group'
            }
        });

        const fieldset = wrapper.find('fieldset');

        expect(fieldset.attributes('disabled')).toBeDefined();
        expect(fieldset.classes()).toContain('my-group');
    });

    it('emits no name on child checkboxes when the group has none', () => {
        const wrapper = mount({
            components: { BaseCheckboxGroup,
                BaseCheckbox },
            template: `
                <BaseCheckboxGroup>
                    <BaseCheckbox value="a"/>
                    <BaseCheckbox value="b"/>
                </BaseCheckboxGroup>
            `
        });

        const inputs = wrapper.findAll('input');

        expect(inputs[0].attributes('name')).toBeUndefined();
        expect(inputs[1].attributes('name')).toBeUndefined();
    });

    it('uses a custom name attribute when provided', () => {
        const wrapper = mount({
            components: { BaseCheckboxGroup,
                BaseCheckbox },
            template: `
                <BaseCheckboxGroup name="my-group">
                    <BaseCheckbox value="a"/>
                    <BaseCheckbox value="b"/>
                </BaseCheckboxGroup>
            `
        });

        const inputs = wrapper.findAll('input');

        expect(inputs[0].attributes('name')).toBe('my-group');
        expect(inputs[1].attributes('name')).toBe('my-group');
    });

    it('lets a child checkbox override the group name via attrs', () => {
        const wrapper = mount({
            components: { BaseCheckboxGroup,
                BaseCheckbox },
            template: `
                <BaseCheckboxGroup name="group-name">
                    <BaseCheckbox value="a" name="override"/>
                    <BaseCheckbox value="b"/>
                </BaseCheckboxGroup>
            `
        });

        const inputs = wrapper.findAll('input');

        expect(inputs[0].attributes('name')).toBe('override');
        expect(inputs[1].attributes('name')).toBe('group-name');
    });

    it('falls back to standalone v-model when used outside a group', async () => {
        const wrapper = mount(BaseCheckbox, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': (e: boolean | unknown[]) => wrapper.setProps({ modelValue: e })
            }
        });

        await wrapper.find('input').setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
            true
        ]);
    });

    it('describes the fieldset with the supporting texts of a wrapping field', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseCheckboxGroup,
                BaseCheckbox,
                BaseSupportingText },
            template: `
                <BaseField>
                    <BaseCheckboxGroup>
                        <BaseCheckbox value="a"/>
                    </BaseCheckboxGroup>
                    <BaseSupportingText>Pick some</BaseSupportingText>
                </BaseField>
            `
        });

        await nextTick();

        const hintId = wrapper.find('p').attributes('id');

        expect(wrapper.find('fieldset').attributes('aria-describedby')).toBe(hintId);
        expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined();
    });

    it('renders a validation message written inside the group', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseCheckboxGroup,
                BaseCheckbox,
                BaseSupportingText },
            template: `
                <BaseField>
                    <BaseCheckboxGroup>
                        <BaseCheckbox value="a"/>
                        <BaseSupportingText validation/>
                    </BaseCheckboxGroup>
                </BaseField>
            `
        });

        const input = wrapper.find('input');

        input.element.setCustomValidity('Pick at least one');
        await input.trigger('invalid');
        await nextTick();

        const message = wrapper.find('p');

        expect(message.text()).toBe('Pick at least one');
        expect(message.attributes('role')).toBe('alert');
        expect(wrapper.find('fieldset').attributes('aria-describedby')).toBe(message.attributes('id'));
        expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('true');
    });

    // Same trap as on a single control: an undefined value in $attrs must not
    // read as the app taking over the fieldset's invalid state.
    it('keeps flagging the fieldset when aria-invalid is passed as undefined', async () => {
        const wrapper = mount({
            components: { BaseField,
                BaseCheckboxGroup,
                BaseCheckbox },
            template: `
                <BaseField>
                    <BaseCheckboxGroup :aria-invalid="undefined">
                        <BaseCheckbox value="a"/>
                    </BaseCheckboxGroup>
                </BaseField>
            `
        });

        const input = wrapper.find('input');

        input.element.setCustomValidity('Pick at least one');
        await input.trigger('invalid');
        await nextTick();

        expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('true');
    });

    describe('self-wired, without a CField', () => {
        const components = {
            BaseCheckboxGroup,
            BaseCheckbox,
            BaseField,
            BaseSupportingText
        };

        function mountStandalone(template: string, data: () => Record<string, unknown> = () => ({})) {
            return mount({
                components,
                data,
                template
            }, {
                attachTo: document.body
            });
        }

        const standalone = `
            <form>
                <BaseCheckboxGroup>
                    <legend>Group</legend>
                    <BaseCheckbox value="a" required/>
                    <BaseSupportingText validation>Hint</BaseSupportingText>
                </BaseCheckboxGroup>
            </form>
        `;

        it('describes the fieldset with a supporting text written inside', async () => {
            const wrapper = mountStandalone(standalone);

            await nextTick();
            await nextTick();

            const text = wrapper.find('p');

            expect(wrapper.find('fieldset').attributes('aria-describedby')).toBe(text.attributes('id'));
            expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined();

            wrapper.unmount();
        });

        it('flags the fieldset and shows the message after a rejected submit, then clears it on fix and reset', async () => {
            const wrapper = mountStandalone(standalone);
            const form = wrapper.find('form').element;
            const input = wrapper.find('input');

            form.checkValidity();
            await nextTick();

            expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('true');
            expect(input.attributes('aria-invalid')).toBeUndefined();
            expect(wrapper.find('p').text()).not.toBe('Hint');
            expect(wrapper.find('p').text()).not.toBe('');

            await input.setValue(true);

            expect(wrapper.find('fieldset').attributes('aria-invalid')).toBeUndefined();
            expect(wrapper.find('p').text()).toBe('Hint');

            input.element.checked = false;
            form.checkValidity();
            await nextTick();

            expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('true');

            form.reset();
            await nextTick();

            expect(wrapper.find('fieldset').attributes('aria-invalid')).toBeUndefined();
            expect(wrapper.find('p').text()).toBe('Hint');

            wrapper.unmount();
        });

        it('exposes its invalid state and message', async () => {
            const wrapper = mountStandalone('<form><BaseCheckboxGroup ref="group"><BaseCheckbox value="a" required/></BaseCheckboxGroup></form>');
            const group = (wrapper.vm.$refs.group as { invalid: boolean,
                message: string });

            wrapper.find('form').element.checkValidity();
            await nextTick();

            expect(group.invalid).toBe(true);
            expect(group.message).not.toBe('');

            wrapper.unmount();
        });

        it('handles an invalid event once when wrapped in a CField', async () => {
            const wrapper = mountStandalone(`
                <form>
                    <BaseField>
                        <BaseCheckboxGroup>
                            <BaseCheckbox value="a" required/>
                        </BaseCheckboxGroup>
                    </BaseField>
                </form>
            `);

            wrapper.find('form').element.checkValidity();
            await nextTick();

            expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('true');

            wrapper.unmount();
        });
    });

    describe('legend prop', () => {
        it('renders the legend as the first child of the fieldset', () => {
            const wrapper = mount(BaseCheckboxGroup, {
                props: { legend: 'Plan' },
                slots: { default: '<span class="child">child</span>' }
            });
            const fieldset = wrapper.find('fieldset').element;

            expect(fieldset.firstElementChild?.tagName).toBe('LEGEND');
            expect(fieldset.firstElementChild?.textContent).toBe('Plan');
            expect(fieldset.children[1].className).toBe('child');
        });

        it('renders no legend without the prop', () => {
            const wrapper = mount(BaseCheckboxGroup, {
                slots: { default: '<span class="child">child</span>' }
            });

            expect(wrapper.find('legend').exists()).toBe(false);
        });

        it('keeps a slotted legend working without the prop', () => {
            const wrapper = mount(BaseCheckboxGroup, {
                slots: { default: '<legend>Slotted</legend><input type="checkbox" value="a"/>' }
            });

            expect(wrapper.findAll('legend')).toHaveLength(1);
            expect(wrapper.find('fieldset').element.firstElementChild?.textContent).toBe('Slotted');
        });

        it('does not leak the prop as an attribute', () => {
            const wrapper = mount(BaseCheckboxGroup, { props: { legend: 'Plan' } });

            expect(wrapper.find('fieldset').attributes('legend')).toBeUndefined();
        });
    });
});
