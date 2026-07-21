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
