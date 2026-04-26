import type { InjectionKey, ModelRef, ComputedRef } from 'vue';

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
