import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import BaseForm from '../BaseForm.vue';

describe('BaseForm', () => {
    it('renders a <form> tag by default', () => {
        const wrapper = mount(BaseForm);

        expect(wrapper.element.tagName).toBe('FORM');
    });

    it('emits a "submit" event when submitted', async () => {
        const wrapper = mount(BaseForm);

        const event = new SubmitEvent('submit', { bubbles: true,
            cancelable: true });
        wrapper.element.dispatchEvent(event);
        await nextTick();

        expect(wrapper.emitted()).toHaveProperty('submit');
        expect(wrapper.emitted('submit')).toHaveLength(1);
        expect(wrapper.emitted('submit')![0][0]).toBeInstanceOf(SubmitEvent);
    });

    it('generates an automatic ID via useId', () => {
        const wrapper = mount(BaseForm);

        expect(wrapper.find('form').attributes('id')).toBeTruthy();
    });

    it('prevents default browser navigation on submit', async () => {
        const wrapper = mount(BaseForm);

        const event = new Event('submit', {
            bubbles: true,
            cancelable: true
        });

        await wrapper.find('form').element.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });

    it('renders slot content and inherits attributes', () => {
        const wrapper = mount(BaseForm, {
            slots: {
                default: '<p>Inside Form</p>'
            },
            attrs: {
                id: 'my-form',
                class: 'flex-col'
            }
        });

        expect(wrapper.html()).toContain('Inside Form');
        expect(wrapper.attributes('id')).toBe('my-form');
        expect(wrapper.classes()).toContain('flex-col');
    });

    it('does not add novalidate without the validate prop', () => {
        const wrapper = mount(BaseForm);

        expect(wrapper.attributes('novalidate')).toBeUndefined();
    });

    it('adds novalidate with the validate prop', () => {
        const wrapper = mount(BaseForm, {
            props: {
                validate: true
            }
        });

        expect(wrapper.attributes('novalidate')).toBeDefined();
    });

    it('keeps a novalidate passed by the app without the validate prop', () => {
        const wrapper = mount(BaseForm, {
            attrs: {
                novalidate: true
            }
        });

        expect(wrapper.attributes('novalidate')).toBeDefined();
    });

    it('keeps a bare novalidate written as an empty string', () => {
        const wrapper = mount(BaseForm, {
            attrs: {
                novalidate: ''
            }
        });

        expect(wrapper.attributes('novalidate')).toBeDefined();
    });

    it('drops novalidate bound to false', () => {
        const wrapper = mount(BaseForm, {
            attrs: {
                novalidate: false
            }
        });

        expect(wrapper.attributes('novalidate')).toBeUndefined();
    });

    it('blocks submit and focuses the first invalid control when validating', async () => {
        const wrapper = mount(BaseForm, {
            props: {
                validate: true
            },
            slots: {
                default: '<input value="ok" required/><input class="empty" required/><button type="submit"/>'
            },
            attachTo: document.body
        });

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toBeUndefined();
        expect(document.activeElement).toBe(wrapper.find('.empty').element);

        wrapper.unmount();
    });

    it('emits invalid-submit when validation blocks the submission', async () => {
        const wrapper = mount(BaseForm, {
            props: {
                validate: true
            },
            slots: {
                default: '<input required/><button type="submit"/>'
            }
        });

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toBeUndefined();
        expect(wrapper.emitted('invalid-submit')).toHaveLength(1);
        expect(wrapper.emitted('invalid-submit')![0][0]).toBeInstanceOf(Event);
    });

    it('does not emit invalid-submit on a submission that goes through', async () => {
        const wrapper = mount(BaseForm, {
            props: {
                validate: true
            },
            slots: {
                default: '<input value="ok" required/><button type="submit"/>'
            }
        });

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toHaveLength(1);
        expect(wrapper.emitted('invalid-submit')).toBeUndefined();
    });

    it('does not emit invalid-submit without the validate prop', async () => {
        const wrapper = mount(BaseForm, {
            slots: {
                default: '<input required/><button type="submit"/>'
            }
        });

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toHaveLength(1);
        expect(wrapper.emitted('invalid-submit')).toBeUndefined();
    });

    // The reason the event is not simply called `invalid`: a declared emit is
    // taken out of $attrs, which would stop `@invalid` from reaching the DOM.
    it('leaves the native invalid event to the app', () => {
        const onInvalid = vi.fn();
        const wrapper = mount(BaseForm, {
            attrs: { onInvalid }
        });

        wrapper.element.dispatchEvent(new Event('invalid', {
            bubbles: false,
            cancelable: true
        }));

        expect(onInvalid).toHaveBeenCalledTimes(1);
    });

    it('skips validation when the submitter carries formnovalidate', async () => {
        const wrapper = mount(BaseForm, {
            props: {
                validate: true
            },
            slots: {
                default: '<input required/><button type="submit" class="draft" formnovalidate/>'
            }
        });

        const submitter = wrapper.find('.draft').element as HTMLButtonElement;

        wrapper.element.dispatchEvent(new SubmitEvent('submit', { submitter,
            bubbles: true,
            cancelable: true }));
        await nextTick();

        expect(wrapper.emitted('submit')).toHaveLength(1);
    });

    it('still validates when the submitter has no formnovalidate', async () => {
        const wrapper = mount(BaseForm, {
            props: {
                validate: true
            },
            slots: {
                default: '<input required/><button type="submit" class="publish"/>'
            }
        });

        const submitter = wrapper.find('.publish').element as HTMLButtonElement;

        wrapper.element.dispatchEvent(new SubmitEvent('submit', { submitter,
            bubbles: true,
            cancelable: true }));
        await nextTick();

        expect(wrapper.emitted('submit')).toBeUndefined();
    });

    it('emits submit when the form is valid while validating', async () => {
        const wrapper = mount(BaseForm, {
            props: {
                validate: true
            },
            slots: {
                default: '<input value="ok" required/>'
            }
        });

        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')).toHaveLength(1);
    });
});
