import { ref, watch } from 'vue';
import type { Ref } from 'vue';

export interface ModelModifiers {
    trim?: boolean
    number?: boolean
    lazy?: boolean
}

// Same order as Vue's native vModelText: trim first, then number.
export function applyModelModifiers(value: string | number, modifiers: ModelModifiers): string | number {
    if (modifiers.trim && typeof value === 'string') {
        value = value.trim();
    }

    if (modifiers.number && typeof value === 'string') {
        const parsed = parseFloat(value);

        value = isNaN(parsed) ? value : parsed;
    }

    return value;
}

// The element is bound to this raw value instead of to the model: a modifier
// changes what the app receives, never what the user sees while typing.
//
// Applying the modifiers inside the model itself is what broke that. The model
// fed `v-model` straight back to the element, so pressing space in a trimmed
// field wrote the trimmed value into it and the space disappeared under the
// cursor — `Jean Dupont` came out as `JeanDupont`. Vue's own `v-model.trim`
// never does that: its directive skips writing back to a focused field whose
// value already trims to the model, and the same guard lives here as the
// `normalize(raw) !== value` test.
export function useModifiedModel(
    model: Ref<string | number | undefined>,
    modifiers: ModelModifiers
) {
    const raw = ref<string | number | undefined>(model.value);

    // What the model was last told. The model itself lags: a parent only sends
    // the new value back down on the next tick, so comparing against it would
    // re-emit a value the app already holds.
    let pushed = model.value;

    function normalize(value: string | number | undefined) {
        return value === undefined ? undefined : applyModelModifiers(value, modifiers);
    }

    // Synchronous, so the model is already up to date inside the very input
    // event that changed it — where `v-model` used to write it. Several raw
    // values normalize to the same one: typing a space in a trimmed field
    // changes nothing for the app and is not worth an update.
    watch(raw, (value) => {
        const normalized = normalize(value);

        if (normalized !== pushed) {
            pushed = normalized;
            model.value = normalized;
        }
    }, { flush: 'sync' });

    // Only a value the element cannot produce on its own is pushed back into
    // it. Sending the normalized value down is exactly what ate the space.
    watch(model, (value) => {
        pushed = value;

        if (normalize(raw.value) !== value) {
            raw.value = value;
        }
    });

    // Vue normalizes the visible field on `change` when `trim` or `number` is
    // set, so the value the user leaves behind is the value the app holds.
    function handleChange() {
        raw.value = normalize(raw.value);
    }

    return {
        raw,
        handleChange
    };
}
