import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
    it('doit rendre le bouton avec son contenu', () => {
        const wrapper = mount(BaseButton, {
            slots: {
                default: 'Envoyer'
            }
        });

        expect(wrapper.text()).toBe('Envoyer');
        expect(wrapper.element.tagName).toBe('BUTTON');
    });

    it('doit changer de balise avec la prop "as"', () => {
        const wrapper = mount(BaseButton, {
            props: {
                as: 'a',
                href: '#'
            },
            slots: {
                default: 'Lien'
            }
        });

        expect(wrapper.element.tagName).toBe('A');
    });
});
