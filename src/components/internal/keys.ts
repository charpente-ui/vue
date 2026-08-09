import type { InjectionKey, ModelRef, ComputedRef, Ref } from 'vue';

export interface RadioGroupContext {
    model: ModelRef<string | number | undefined>
    name: ComputedRef<string>
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('CRadioGroup');

export interface CheckboxGroupContext {
    model: ModelRef<(string | number)[]>
    name: ComputedRef<string | undefined>
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('CCheckboxGroup');

export interface FieldContext {
    // Undefined inside a group: the field id belongs to a single control, so a
    // group hands its items a context without one.
    id: ComputedRef<string | undefined>
    describedBy: ComputedRef<string | undefined>
    invalid: Ref<boolean>
    validationMessage: Ref<string>
    registerSupportingText: (id: string) => void
    unregisterSupportingText: (id: string) => void
    // Custom validity is set by JS after the events the field listens to have
    // already fired, so a control that owns a rule reports its new state here.
    syncValidity: (control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => void
}

export const fieldKey: InjectionKey<FieldContext | null> = Symbol('CField');
