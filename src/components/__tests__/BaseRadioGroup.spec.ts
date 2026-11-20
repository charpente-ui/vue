import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
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

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
            'foo'
        ]);
    });

    describe('self-wired, without a CField', () => {
        const components = {
            BaseRadioGroup,
            BaseRadio,
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
                <BaseRadioGroup>
                    <legend>Group</legend>
                    <BaseRadio value="a" required/>
                    <BaseSupportingText validation>Hint</BaseSupportingText>
                </BaseRadioGroup>
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
            const wrapper = mountStandalone('<form><BaseRadioGroup ref="group"><BaseRadio value="a" required/></BaseRadioGroup></form>');
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
                        <BaseRadioGroup>
                            <BaseRadio value="a" required/>
                        </BaseRadioGroup>
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
            const wrapper = mount(BaseRadioGroup, {
                props: { legend: 'Plan' },
                slots: { default: '<span class="child">child</span>' }
            });
            const fieldset = wrapper.find('fieldset').element;

            expect(fieldset.firstElementChild?.tagName).toBe('LEGEND');
            expect(fieldset.firstElementChild?.textContent).toBe('Plan');
            expect(fieldset.children[1].className).toBe('child');
        });

        it('renders no legend without the prop', () => {
            const wrapper = mount(BaseRadioGroup, {
                slots: { default: '<span class="child">child</span>' }
            });

            expect(wrapper.find('legend').exists()).toBe(false);
        });

        it('keeps a slotted legend working without the prop', () => {
            const wrapper = mount(BaseRadioGroup, {
                slots: { default: '<legend>Slotted</legend><input type="radio" value="a"/>' }
            });

            expect(wrapper.findAll('legend')).toHaveLength(1);
            expect(wrapper.find('fieldset').element.firstElementChild?.textContent).toBe('Slotted');
        });

        it('does not leak the prop as an attribute', () => {
            const wrapper = mount(BaseRadioGroup, { props: { legend: 'Plan' } });

            expect(wrapper.find('fieldset').attributes('legend')).toBeUndefined();
        });
    });

    it('does not add its own reset listener on the form when inside a CField', () => {
        const spy = vi.spyOn(HTMLFormElement.prototype, 'addEventListener');
        const countResets = (template: string) => {
            spy.mockClear();

            const wrapper = mount({
                components: { BaseRadioGroup,
                    BaseRadio,
                    BaseField },
                template
            }, { attachTo: document.body });
            const count = spy.mock.calls.filter(([
                type
            ]) => type === 'reset').length;

            wrapper.unmount();

            return count;
        };

        const withGroup = countResets('<form><BaseField><BaseRadioGroup><BaseRadio value="a"/></BaseRadioGroup></BaseField></form>');
        const withoutGroup = countResets('<form><BaseField><BaseRadio value="a"/></BaseField></form>');

        spy.mockRestore();

        expect(withGroup).toBe(withoutGroup);
    });
});
