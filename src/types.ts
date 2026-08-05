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
