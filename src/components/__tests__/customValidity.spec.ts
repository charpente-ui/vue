import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { nextTick, ref } from 'vue';
import BaseInput from '../BaseInput.vue';
import BaseTextarea from '../BaseTextarea.vue';
import BaseSelect from '../BaseSelect.vue';
import BaseCheckbox from '../BaseCheckbox.vue';
import BaseCheckboxGroup from '../BaseCheckboxGroup.vue';
import BaseRadio from '../BaseRadio.vue';
import BaseFile from '../BaseFile.vue';
import BaseField from '../BaseField.vue';
import BaseForm from '../BaseForm.vue';
import BaseSupportingText from '../BaseSupportingText.vue';

describe('custom validity', () => {
    it('marks the control invalid when the rule returns a message', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: 'nope',
                rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
            }
        });

        await nextTick();

        const input = wrapper.find('input').element;

        expect(input.validity.customError).toBe(true);
        expect(input.validationMessage).toBe('Wrong value.');
        expect(input.checkValidity()).toBe(false);
    });

    it('leaves the control valid when the rule returns an empty string', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: 'ok',
                rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
            }
        });

        await nextTick();

        expect(wrapper.find('input').element.validity.valid).toBe(true);
    });

    it('re-evaluates the rule when the model changes', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: 'nope',
                rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
            }
        });

        await nextTick();

        const input = wrapper.find('input').element;

        expect(input.validity.customError).toBe(true);

        await wrapper.setProps({
            modelValue: 'ok'
        });
        await nextTick();

        expect(input.validity.customError).toBe(false);
        expect(input.validationMessage).toBe('');
    });

    it('re-evaluates when another reactive value the rule reads changes', async () => {
        const password = ref('secret');

        const wrapper = mount(BaseInput, {
            props: {
                modelValue: 'secret',
                rule: (value: unknown) => value === password.value ? '' : 'Passwords must match.'
            }
        });

        await nextTick();

        const input = wrapper.find('input').element;

        expect(input.validity.valid).toBe(true);

        password.value = 'changed';
        await nextTick();

        expect(input.validity.customError).toBe(true);
        expect(input.validationMessage).toBe('Passwords must match.');
    });

    it('keeps the native message when a native constraint already fails', async () => {
        const wrapper = mount(BaseInput, {
            attrs: {
                required: true
            },
            props: {
                modelValue: '',
                rule: () => 'Custom message.'
            }
        });

        await nextTick();

        const input = wrapper.find('input').element;

        expect(input.validity.valueMissing).toBe(true);
        expect(input.validity.customError).toBe(false);
        expect(input.validationMessage).not.toBe('Custom message.');
    });

    it('applies the rule once the native constraints pass', async () => {
        const wrapper = mount(BaseInput, {
            attrs: {
                required: true
            },
            props: {
                modelValue: '',
                rule: (value: unknown) => value === 'ok' ? '' : 'Custom message.'
            }
        });

        await nextTick();

        expect(wrapper.find('input').element.validity.customError).toBe(false);

        await wrapper.setProps({
            modelValue: 'nope'
        });
        await nextTick();

        expect(wrapper.find('input').element.validationMessage).toBe('Custom message.');
    });

    // Without `required` an empty value satisfies every native constraint, so
    // there is nothing to hold the rule back: it is the one check that still
    // runs on an empty optional field. A rule that rejects '' therefore makes
    // the field mandatory in practice, which the guide warns against.
    it('applies the rule to an empty value on an optional field', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: '',
                rule: (value: unknown) => value ? '' : 'Empty is rejected.'
            }
        });

        await nextTick();

        const input = wrapper.find('input').element;

        expect(input.validity.valueMissing).toBe(false);
        expect(input.validity.customError).toBe(true);
        expect(input.validationMessage).toBe('Empty is rejected.');
    });

    // Native validity can flip without the model moving — a reactive
    // `:required` turned off is the common case. Nothing about `validity` is
    // reactive, so this is the one path the watch cannot see.
    it('applies a held-back message when a native constraint is lifted', async () => {
        const wrapper = mount({
            components: {
                BaseInput
            },
            data() {
                return {
                    mandatory: true,
                    value: '',
                    rule: () => 'Custom message.'
                };
            },
            template: '<BaseInput v-model="value" :required="mandatory" :rule="rule"/>'
        });

        await nextTick();

        const input = wrapper.find('input').element;

        expect(input.validity.valueMissing).toBe(true);
        expect(input.validity.customError).toBe(false);

        await wrapper.setData({
            mandatory: false
        });
        await nextTick();

        expect(input.validity.customError).toBe(true);
        expect(input.validationMessage).toBe('Custom message.');
    });

    it('does not touch a custom validity set by hand when no rule is passed', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: 'anything'
            }
        });

        await nextTick();

        const input = wrapper.find('input').element;

        input.setCustomValidity('Set from outside.');

        await wrapper.setProps({
            modelValue: 'changed'
        });
        await nextTick();

        expect(input.validationMessage).toBe('Set from outside.');
    });

    it('clears its own message when the rule is removed at runtime', async () => {
        const rule = (value: unknown) => value === 'ok' ? '' : 'Wrong value.';

        const wrapper = mount(BaseInput, {
            props: {
                modelValue: 'nope',
                rule
            }
        });

        await nextTick();

        const input = wrapper.find('input').element;

        expect(input.validity.customError).toBe(true);

        await wrapper.setProps({
            rule: undefined
        });
        await nextTick();

        expect(input.validity.customError).toBe(false);
    });

    it('shows the message through the field once the browser has rejected it', async () => {
        const wrapper = mount({
            components: {
                BaseField,
                BaseInput,
                BaseSupportingText
            },
            data() {
                return {
                    value: 'nope',
                    rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
                };
            },
            template: `
                <BaseField>
                    <BaseInput v-model="value" :rule="rule"/>
                    <BaseSupportingText validation/>
                </BaseField>
            `
        });

        await nextTick();

        const input = wrapper.find('input');

        input.element.checkValidity();
        await nextTick();

        expect(wrapper.find('p').text()).toBe('Wrong value.');
        expect(input.attributes('aria-invalid')).toBe('true');
    });

    it('clears the field message as soon as the rule passes again', async () => {
        const wrapper = mount({
            components: {
                BaseField,
                BaseInput,
                BaseSupportingText
            },
            data() {
                return {
                    value: 'nope',
                    rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
                };
            },
            template: `
                <BaseField>
                    <BaseInput v-model="value" :rule="rule"/>
                    <BaseSupportingText validation>Hint</BaseSupportingText>
                </BaseField>
            `
        });

        await nextTick();

        const input = wrapper.find('input');

        input.element.checkValidity();
        await nextTick();

        expect(wrapper.find('p').text()).toBe('Wrong value.');

        await input.setValue('ok');
        await nextTick();

        expect(wrapper.find('p').text()).toBe('Hint');
        expect(input.attributes('aria-invalid')).toBeUndefined();
    });

    it('stays silent until the browser has rejected the control', async () => {
        const wrapper = mount({
            components: {
                BaseField,
                BaseInput,
                BaseSupportingText
            },
            data() {
                return {
                    value: 'nope',
                    rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
                };
            },
            template: `
                <BaseField>
                    <BaseInput v-model="value" :rule="rule"/>
                    <BaseSupportingText validation>Hint</BaseSupportingText>
                </BaseField>
            `
        });

        await nextTick();

        expect(wrapper.find('p').text()).toBe('Hint');
        expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined();
    });

    it('blocks submission through CForm validate', async () => {
        const wrapper = mount({
            components: {
                BaseForm,
                BaseField,
                BaseInput
            },
            data() {
                return {
                    value: 'nope',
                    submitted: 0,
                    rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
                };
            },
            methods: {
                onSubmit() {
                    this.submitted += 1;
                }
            },
            template: `
                <BaseForm validate @submit="onSubmit">
                    <BaseField>
                        <BaseInput v-model="value" :rule="rule"/>
                    </BaseField>
                </BaseForm>
            `
        });

        await nextTick();

        await wrapper.find('form').trigger('submit');

        expect(wrapper.vm.submitted).toBe(0);

        await wrapper.find('input').setValue('ok');
        await nextTick();

        await wrapper.find('form').trigger('submit');

        expect(wrapper.vm.submitted).toBe(1);
    });

    it('applies to a textarea', async () => {
        const wrapper = mount(BaseTextarea, {
            props: {
                modelValue: 'nope',
                rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
            }
        });

        await nextTick();

        expect(wrapper.find('textarea').element.validationMessage).toBe('Wrong value.');
    });

    it('applies to a select', async () => {
        const wrapper = mount(BaseSelect, {
            props: {
                modelValue: 'a',
                options: ['a',
                    'b'],
                rule: (value: unknown) => value === 'b' ? '' : 'Pick b.'
            }
        });

        await nextTick();

        expect(wrapper.find('select').element.validationMessage).toBe('Pick b.');
    });

    it('applies to a checkbox', async () => {
        const wrapper = mount(BaseCheckbox, {
            props: {
                modelValue: false,
                rule: (value: unknown) => value ? '' : 'You must accept.'
            }
        });

        await nextTick();

        expect(wrapper.find('input').element.validationMessage).toBe('You must accept.');
    });

    it('applies to a radio', async () => {
        const wrapper = mount(BaseRadio, {
            props: {
                value: 'a',
                modelValue: 'b',
                rule: (value: unknown) => value === 'a' ? '' : 'Pick a.'
            }
        });

        await nextTick();

        expect(wrapper.find('input').element.validationMessage).toBe('Pick a.');
    });

    it('applies to a file input', async () => {
        const wrapper = mount(BaseFile, {
            props: {
                modelValue: null,
                rule: (value: unknown) => value ? '' : 'A file is required.'
            }
        });

        await nextTick();

        expect(wrapper.find('input').element.validationMessage).toBe('A file is required.');
    });

    it('reports a rule set on a group item through the whole group', async () => {
        const wrapper = mount({
            components: {
                BaseField,
                BaseCheckboxGroup,
                BaseCheckbox,
                BaseSupportingText
            },
            data() {
                return {
                    selected: [] as string[],
                    rule: (value: unknown) => (value as string[]).length >= 2 ? '' : 'Pick at least two.'
                };
            },
            template: `
                <BaseField>
                    <BaseCheckboxGroup v-model="selected">
                        <legend>Tags</legend>
                        <BaseCheckbox value="a" :rule="rule"/>
                        <BaseCheckbox value="b"/>
                        <BaseSupportingText validation/>
                    </BaseCheckboxGroup>
                </BaseField>
            `
        });

        await nextTick();

        wrapper.findAll('input')[0].element.checkValidity();
        await nextTick();

        expect(wrapper.find('p').text()).toBe('Pick at least two.');
        expect(wrapper.find('fieldset').attributes('aria-invalid')).toBe('true');
    });

    // `form.reset()` restores DOM values but never touches a Vue model, so a
    // rule reading that model still sees the value the user typed. Keeping the
    // error is the safe half of a bad trade: clearing it would let an invalid
    // value submit. Resetting the model alongside the form is the real fix, and
    // the second half of this test pins that.
    it('keeps its error after a form reset that leaves the model untouched', async () => {
        const wrapper = mount({
            components: {
                BaseForm,
                BaseField,
                BaseInput
            },
            data() {
                return {
                    value: '',
                    rule: (value: unknown) => value === 'ok' ? '' : 'Wrong value.'
                };
            },
            template: `
                <BaseForm validate>
                    <BaseField>
                        <BaseInput v-model="value" :rule="rule"/>
                    </BaseField>
                </BaseForm>
            `
        });

        await nextTick();

        const input = wrapper.find('input');
        const form = wrapper.find('form').element as HTMLFormElement;

        await input.setValue('bad');
        await nextTick();

        expect(input.element.validity.customError).toBe(true);

        form.reset();
        await nextTick();

        expect(input.element.validity.customError).toBe(true);
        expect(form.checkValidity()).toBe(false);

        await wrapper.setData({
            value: 'ok'
        });
        await nextTick();

        expect(input.element.validity.customError).toBe(false);
        expect(form.checkValidity()).toBe(true);
    });

    // A rule cannot await, but it can read a ref filled asynchronously — which
    // is what makes server-side checks work without any async support in the
    // library. Reporting an error while the answer is in flight is what closes
    // the race between a click on Submit and the response, so both halves are
    // pinned here.
    it('blocks submission while an async check is in flight, then reports its answer', async () => {
        const pending = ref(false);
        const serverError = ref('');
        const submitted = ref(0);

        let settle!: (taken: boolean) => void;

        const wrapper = mount({
            components: {
                BaseForm,
                BaseField,
                BaseInput,
                BaseSupportingText
            },
            setup() {
                const username = ref('');

                function check() {
                    pending.value = true;

                    return new Promise<boolean>((resolve) => {
                        settle = resolve;
                    }).then((taken) => {
                        serverError.value = taken ? 'Username is taken.' : '';
                        pending.value = false;
                    });
                }

                return {
                    username,
                    submitted,
                    check,
                    rule: () => pending.value ? 'Checking availability…' : serverError.value,
                    onSubmit: () => {
                        submitted.value += 1;
                    }
                };
            },
            template: `
                <BaseForm validate @submit="onSubmit">
                    <BaseField>
                        <BaseInput v-model="username" :rule="rule" @input="check"/>
                        <BaseSupportingText validation>Hint</BaseSupportingText>
                    </BaseField>
                </BaseForm>
            `
        });

        await nextTick();

        const input = wrapper.find('input');

        await input.setValue('boris');
        await nextTick();

        expect(input.element.validationMessage).toBe('Checking availability…');

        await wrapper.find('form').trigger('submit');

        expect(submitted.value).toBe(0);

        settle(true);
        await new Promise((resolve) => setTimeout(resolve, 0));
        await nextTick();

        expect(input.element.validationMessage).toBe('Username is taken.');
        expect(wrapper.find('p').text()).toBe('Username is taken.');

        await wrapper.find('form').trigger('submit');

        expect(submitted.value).toBe(0);

        settle = () => {};
        serverError.value = '';
        await nextTick();

        await wrapper.find('form').trigger('submit');

        expect(submitted.value).toBe(1);
    });

    it('receives the element as the second argument', async () => {
        const seen: string[] = [];

        mount(BaseInput, {
            attrs: {
                id: 'the-input'
            },
            props: {
                modelValue: 'x',
                rule: (_value: unknown, element: HTMLInputElement) => {
                    seen.push(element.id);

                    return '';
                }
            }
        });

        await nextTick();

        expect(seen).toContain('the-input');
    });

    it('works outside a field', async () => {
        const wrapper = mount(BaseInput, {
            props: {
                modelValue: 'nope',
                rule: () => 'Wrong value.'
            }
        });

        await nextTick();

        expect(wrapper.find('input').element.validationMessage).toBe('Wrong value.');
    });
});
