import type { InjectionKey, ModelRef, ComputedRef, Ref } from 'vue';

export interface RadioGroupContext {
    model: ModelRef<string | number | undefined>
    name: ComputedRef<string>
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('CRadioGroup');

export interface CheckboxGroupContext {
    model: ModelRef<(string | number)[]>
    name: ComputedRef<string>
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('CCheckboxGroup');

export interface FieldContext {
    id: ComputedRef<string>
    supportingTextId: Ref<string | undefined>
    validationMessage: Ref<string>
}

export const fieldKey: InjectionKey<FieldContext | null> = Symbol('CField');
