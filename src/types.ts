export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface SelectOptionGroup {
    label: string;
    options: (SelectOption | string | number)[];
    disabled?: boolean;
}

// A shorthand string/number is used as both the label and the value.
export type SelectOptionItem = SelectOption | SelectOptionGroup | string | number;

// Every element that owns a validity state. `<button>` and `<output>` also do,
// but neither carries a value the library binds.
export type ValidatableElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Returns the error message to display, or an empty string when the value is
// acceptable — the exact contract of `setCustomValidity`.
export type ValidationRule<Value, Element extends ValidatableElement = ValidatableElement> =
    (value: Value, element: Element) => string;
