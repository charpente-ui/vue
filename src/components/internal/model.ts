import { getCurrentInstance } from 'vue';

// Whether the parent bound a v-model on the calling component. Read from what
// the parent passed rather than from the prop: Vue casts an absent boolean prop
// to `false`, so the value alone cannot tell "no v-model" from "v-model bound
// to false" — nor, on any type, from one bound to `undefined`.
export function hasOwnVModel() {
    return !!getCurrentInstance()?.vnode.props?.['onUpdate:modelValue'];
}
