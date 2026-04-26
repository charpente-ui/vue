<script setup lang="ts">
import { ref } from 'vue';
import { CButton,
    CCheckbox,
    CFile,
    CForm,
    CInput,
    CLabel,
    CRadio,
    CRadioGroup,
    CSelect,
    CTextarea } from '@charpente-ui/vue';

const text = ref('');
const number = ref(0);
const textarea = ref('');
const checkbox = ref(false);
const checkboxGroup = ref<string[]>([]);
const radio = ref('');
const select = ref('');
const file = ref<FileList | null>(null);

const form = ref({ name: '',
    email: '',
    message: '',
    terms: false });
const submitted = ref<string | null>(null);

function onSubmit() {
    submitted.value = JSON.stringify(form.value, null, 2);
}

function resetForm() {
    form.value = { name: '',
        email: '',
        message: '',
        terms: false };
    submitted.value = null;
}
</script>

<template>
    <div style="font-family: sans-serif; max-width: 600px; margin: 2rem auto; display: flex; flex-direction: column; gap: 2rem;">
        <h1>Charpente UI — Playground</h1>

        <section>
            <h2>CButton</h2>
            <CButton type="button">Button</CButton>
            <CButton type="button" as="a" href="#">As link</CButton>
        </section>

        <section>
            <h2>CInput</h2>
            <CLabel for="input-text">Text</CLabel>
            <CInput id="input-text" v-model="text" placeholder="Type something..."/>
            <p>Value: {{ text }}</p>

            <CLabel for="input-number">Number</CLabel>
            <CInput id="input-number" v-model="number" type="number"/>
            <p>Value: {{ number }}</p>
        </section>

        <section>
            <h2>CTextarea</h2>
            <CLabel for="my-textarea">Message</CLabel>
            <CTextarea id="my-textarea" v-model="textarea" placeholder="Type something..."/>
            <p>Value: {{ textarea }}</p>
        </section>

        <section>
            <h2>CCheckbox</h2>
            <CLabel for="my-checkbox">Single checkbox</CLabel>
            <CCheckbox id="my-checkbox" v-model="checkbox"/>
            <p>Value: {{ checkbox }}</p>

            <p>Checkbox group</p>
            <CLabel for="cb-a">Option A</CLabel>
            <CCheckbox id="cb-a" v-model="checkboxGroup" value="a"/>

            <CLabel for="cb-b">Option B</CLabel>
            <CCheckbox id="cb-b" v-model="checkboxGroup" value="b"/>
            <p>Value: {{ checkboxGroup }}</p>
        </section>

        <section>
            <h2>CRadioGroup</h2>
            <CRadioGroup v-model="radio" name="radio-group">
                <CLabel for="ra">Option A</CLabel>
                <CRadio id="ra" value="a"/>

                <CLabel for="rb">Option B</CLabel>
                <CRadio id="rb" value="b"/>

                <CLabel for="rc">Option C</CLabel>
                <CRadio id="rc" value="c"/>
            </CRadioGroup>
            <p>Value: {{ radio }}</p>
        </section>

        <section>
            <h2>CSelect</h2>
            <CLabel for="my-select">Pick one</CLabel>
            <CSelect id="my-select" v-model="select">
                <option value="">--</option>
                <option value="a">Option A</option>
                <option value="b">Option B</option>
                <option value="c">Option C</option>
            </CSelect>
            <p>Value: {{ select }}</p>
        </section>

        <section>
            <h2>CFile</h2>
            <CLabel for="my-file">Upload</CLabel>
            <CFile id="my-file" v-model="file"/>
            <p>File: {{ file?.[0]?.name ?? 'none' }}</p>
        </section>

        <section>
            <h2>CForm</h2>
            <CForm @submit="onSubmit">
                <div>
                    <CLabel for="form-name">Name *</CLabel>
                    <CInput id="form-name" v-model="form.name" placeholder="John Doe" required/>
                </div>
                <div>
                    <CLabel for="form-email">Email *</CLabel>
                    <CInput id="form-email" v-model="form.email" type="email" placeholder="john@example.com" required/>
                </div>
                <div>
                    <CLabel for="form-message">Message</CLabel>
                    <CTextarea id="form-message" v-model="form.message" placeholder="Your message..."/>
                </div>
                <div>
                    <CLabel for="form-terms">
                        <CCheckbox id="form-terms" v-model="form.terms" required/>
                        I accept the terms
                    </CLabel>
                </div>
                <CButton type="submit">Submit</CButton>
                <CButton type="reset" @click="resetForm">Reset</CButton>
            </CForm>
            <pre v-if="submitted">{{ submitted }}</pre>
        </section>
    </div>
</template>
