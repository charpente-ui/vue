import type { InjectionKey, ModelRef, ComputedRef } from 'vue';

export interface RadioGroupContext {
    model: ModelRef<string | number | undefined>
    name: ComputedRef<string>
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('CRadioGroup');
