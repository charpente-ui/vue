import type { InjectionKey, ModelRef, ComputedRef } from 'vue';

export interface RadioGroupContext {
    model: ModelRef<unknown>
    name: ComputedRef<string>
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('CRadioGroup');

export interface CheckboxGroupContext {
    model: ModelRef<unknown[]>
    name: ComputedRef<string>
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('CCheckboxGroup');
