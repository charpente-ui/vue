import type { ComponentPublicInstance } from 'vue';

// A template ref set on `<component :is>` holds the element when a tag was
// rendered, and the component's instance when a component was. Unwrapping `$el`
// keeps the exposed `el` a DOM node either way, so an app never has to know
// which one it got — and `null` when the rendered component has no single root
// element, rather than the comment node Vue anchors a fragment with.
export function toElement(value: HTMLElement | ComponentPublicInstance | null): HTMLElement | null {
    const element = (value as ComponentPublicInstance)?.$el ?? value;

    return element instanceof HTMLElement ? element : null;
}
