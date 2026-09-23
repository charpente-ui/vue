import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import BaseCheckbox from '../BaseCheckbox.vue';
import BaseCheckboxGroup from '../BaseCheckboxGroup.vue';
import BaseField from '../BaseField.vue';
import BaseLabel from '../BaseLabel.vue';
import BaseRadio from '../BaseRadio.vue';
import BaseRadioGroup from '../BaseRadioGroup.vue';

const components = {
    BaseCheckbox,
    BaseCheckboxGroup,
    BaseField,
    BaseLabel,
    BaseRadio,
    BaseRadioGroup
};

// Each warning names a mistake that otherwise fails silently. They are
// development-only: the guard is left for the app's bundler to resolve, so a
// production build carries neither the check nor the message.
describe('development warnings', () => {
    let warn: MockInstance<typeof console.warn>;

    beforeEach(() => {
        warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warn.mockRestore();
        vi.unstubAllEnvs();
    });

    function charpenteWarnings() {
        return warn.mock.calls.map(([
            message
        ]) => String(message)).filter((message) => message.startsWith('[Charpente]'));
    }

    describe('a CLabel inside a group', () => {
        it.each([
            [
                'next to its radio',
                '<BaseRadioGroup><BaseRadio value="a"/><BaseLabel>A</BaseLabel></BaseRadioGroup>'
            ],
            [
                'next to its checkbox',
                '<BaseCheckboxGroup><BaseCheckbox value="a"/><BaseLabel>A</BaseLabel></BaseCheckboxGroup>'
            ],
            [
                'in a group wrapped by a CField',
                '<BaseField><BaseRadioGroup><BaseRadio value="a"/><BaseLabel>A</BaseLabel></BaseRadioGroup></BaseField>'
            ]
        ])('warns when it labels nothing, %s', (_, template) => {
            mount({
                components,
                template
            });

            expect(charpenteWarnings()).toEqual([
                expect.stringContaining('CLabel inside a CRadioGroup or CCheckboxGroup')
            ]);
        });

        it.each([
            [
                'wrapping its control',
                '<BaseRadioGroup><BaseLabel><BaseRadio value="a"/> A</BaseLabel></BaseRadioGroup>'
            ],
            [
                'naming it with for',
                '<BaseRadioGroup><BaseRadio id="a" value="a"/><BaseLabel for="a">A</BaseLabel></BaseRadioGroup>'
            ],
            [
                'inside an item-level CField',
                '<BaseRadioGroup><BaseField><BaseRadio value="a"/><BaseLabel>A</BaseLabel></BaseField></BaseRadioGroup>'
            ]
        ])('stays silent when %s', (_, template) => {
            mount({
                components,
                template
            }, {
                attachTo: document.body
            }).unmount();

            expect(charpenteWarnings()).toEqual([]);
        });

        // Outside a group the field id always reaches the label, and a bare
        // label is the app's own markup: nothing the library dropped.
        it('stays silent outside a group', () => {
            mount(BaseLabel);

            expect(charpenteWarnings()).toEqual([]);
        });
    });

    describe('an item v-model inside a group', () => {
        it.each([
            [
                'CCheckbox',
                '<BaseCheckboxGroup><BaseCheckbox v-model="own" value="a"/></BaseCheckboxGroup>'
            ],
            [
                'CRadio',
                '<BaseRadioGroup><BaseRadio v-model="own" value="a"/></BaseRadioGroup>'
            ]
        ])('warns that the %s v-model is ignored', (name, template) => {
            mount({
                components,
                data: () => ({
                    own: false
                }),
                template
            });

            expect(charpenteWarnings()).toEqual([
                expect.stringContaining(`${name} inside a`)
            ]);
        });

        // Vue casts an absent boolean prop to `false`: reading the prop would
        // flag every checkbox of every group.
        it.each([
            '<BaseCheckboxGroup><BaseCheckbox value="a"/></BaseCheckboxGroup>',
            '<BaseRadioGroup><BaseRadio value="a"/></BaseRadioGroup>'
        ])('stays silent without one: %s', (template) => {
            mount({
                components,
                template
            });

            expect(charpenteWarnings()).toEqual([]);
        });

        it('stays silent on a standalone item with its own v-model', () => {
            mount({
                components,
                data: () => ({
                    own: false
                }),
                template: '<BaseCheckbox v-model="own"/><BaseRadio v-model="own" value="a"/>'
            });

            expect(charpenteWarnings()).toEqual([]);
        });
    });

    it('stays silent in a production build', () => {
        vi.stubEnv('NODE_ENV', 'production');

        mount({
            components,
            data: () => ({
                own: false
            }),
            template: `
                <BaseRadioGroup><BaseRadio v-model="own" value="a"/><BaseLabel>A</BaseLabel></BaseRadioGroup>
                <BaseCheckboxGroup><BaseCheckbox v-model="own" value="b"/></BaseCheckboxGroup>
            `
        });

        expect(charpenteWarnings()).toEqual([]);
    });
});
