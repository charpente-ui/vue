<script setup lang="ts">
import { ref } from 'vue';
import { CButton,
    CCheckbox,
    CCheckboxGroup,
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
const radioStandalone = ref('');
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
    <div class="layout">
        <header class="header">
            <h1>Charpente UI <span class="badge">Playground</span></h1>
            <p class="subtitle">Headless Vue 3 components — zero CSS, full control.</p>
        </header>

        <div class="notice">
            These components ship with <strong>no styles</strong>. What you see below is raw browser rendering —
            no classes are applied to any component. Bring your own CSS, Tailwind, or any design system.
        </div>

        <main class="sections">
            <section class="card">
                <h2>CButton</h2>
                <div class="row">
                    <CButton type="button">Button</CButton>
                    <CButton type="button" as="a" href="#">As link</CButton>
                </div>
            </section>

            <section class="card">
                <h2>CInput</h2>
                <div class="field">
                    <CLabel for="input-text">Text</CLabel>
                    <CInput id="input-text" v-model="text" placeholder="Type something..."/>
                </div>
                <div class="field">
                    <CLabel for="input-number">Number</CLabel>
                    <CInput id="input-number" v-model="number" type="number"/>
                </div>
                <p class="value">Value: <code>{{ text || number }}</code></p>
            </section>

            <section class="card">
                <h2>CTextarea</h2>
                <div class="field">
                    <CLabel for="my-textarea">Message</CLabel>
                    <CTextarea id="my-textarea" v-model="textarea" placeholder="Type something..."/>
                </div>
                <p class="value">Value: <code>{{ textarea }}</code></p>
            </section>

            <section class="card">
                <h2>CCheckbox</h2>
                <div class="check-row">
                    <CCheckbox id="my-checkbox" v-model="checkbox"/>
                    <CLabel for="my-checkbox">Single checkbox</CLabel>
                </div>
                <p class="value">Value: <code>{{ checkbox }}</code></p>
            </section>

            <section class="card">
                <h2>CCheckboxGroup</h2>
                <CCheckboxGroup v-model="checkboxGroup">
                    <div v-for="opt in ['a', 'b', 'c']" :key="opt" class="check-row">
                        <CCheckbox :id="`cb-${opt}`" :value="opt"/>
                        <CLabel :for="`cb-${opt}`">Option {{ opt.toUpperCase() }}</CLabel>
                    </div>
                </CCheckboxGroup>
                <p class="value">Value: <code>{{ checkboxGroup }}</code></p>
            </section>

            <section class="card">
                <h2>CRadio</h2>
                <div v-for="opt in ['a', 'b', 'c']" :key="opt" class="check-row">
                    <CRadio :id="`rs-${opt}`" v-model="radioStandalone" :value="opt" name="standalone-group"/>
                    <CLabel :for="`rs-${opt}`">Option {{ opt.toUpperCase() }}</CLabel>
                </div>
                <p class="value">Value: <code>{{ radioStandalone }}</code></p>
            </section>

            <section class="card">
                <h2>CRadioGroup</h2>
                <CRadioGroup v-model="radio" name="radio-group">
                    <div v-for="opt in ['a', 'b', 'c']" :key="opt" class="check-row">
                        <CRadio :id="`r-${opt}`" :value="opt"/>
                        <CLabel :for="`r-${opt}`">Option {{ opt.toUpperCase() }}</CLabel>
                    </div>
                </CRadioGroup>
                <p class="value">Value: <code>{{ radio }}</code></p>
            </section>

            <section class="card">
                <h2>CSelect</h2>
                <div class="field">
                    <CLabel for="my-select">Pick one</CLabel>
                    <CSelect id="my-select" v-model="select">
                        <option value="">--</option>
                        <option value="a">Option A</option>
                        <option value="b">Option B</option>
                        <option value="c">Option C</option>
                    </CSelect>
                </div>
                <p class="value">Value: <code>{{ select }}</code></p>
            </section>

            <section class="card">
                <h2>CFile</h2>
                <div class="field">
                    <CLabel for="my-file">Upload</CLabel>
                    <CFile id="my-file" v-model="file"/>
                </div>
                <p class="value">File: <code>{{ file?.[0]?.name ?? 'none' }}</code></p>
            </section>

            <section class="card">
                <h2>CForm</h2>
                <CForm @submit="onSubmit">
                    <div class="field">
                        <CLabel for="form-name">Name *</CLabel>
                        <CInput id="form-name" v-model="form.name" placeholder="John Doe" required/>
                    </div>
                    <div class="field">
                        <CLabel for="form-email">Email *</CLabel>
                        <CInput id="form-email" v-model="form.email" type="email" placeholder="john@example.com" required/>
                    </div>
                    <div class="field">
                        <CLabel for="form-message">Message</CLabel>
                        <CTextarea id="form-message" v-model="form.message" placeholder="Your message..."/>
                    </div>
                    <div class="check-row">
                        <CCheckbox id="form-terms" v-model="form.terms" required/>
                        <CLabel for="form-terms">I accept the terms</CLabel>
                    </div>
                    <div class="row">
                        <CButton type="submit">Submit</CButton>
                        <CButton type="reset" @click="resetForm">Reset</CButton>
                    </div>
                </CForm>
                <pre v-if="submitted" class="output">{{ submitted }}</pre>
            </section>
        </main>
    </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
    background: #f5f5f7;
    color: #1d1d1f;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 15px;
    line-height: 1.5;
}

.layout {
    max-width: 680px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: .6rem;
}

.badge {
    font-size: .7rem;
    font-weight: 600;
    background: #0071e3;
    color: #fff;
    padding: .2rem .5rem;
    border-radius: 999px;
    letter-spacing: .03em;
}

.subtitle {
    color: #6e6e73;
    margin-top: .25rem;
    font-size: .9rem;
}

.notice {
    background: #fff8e6;
    border: 1.5px solid #f5c842;
    border-radius: 10px;
    padding: .75rem 1rem;
    font-size: .875rem;
    color: #7a5c00;
    line-height: 1.5;
}

.sections {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.card {
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,.08);
    display: flex;
    flex-direction: column;
    gap: .75rem;
}

.card h2 {
    font-size: .8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #6e6e73;
    border-bottom: 1px solid #f0f0f5;
    padding-bottom: .5rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: .3rem;
}

.check-row {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.row {
    display: flex;
    gap: .5rem;
}

.value {
    font-size: .8rem;
    color: #6e6e73;
}

.value code {
    background: #f0f0f5;
    padding: .1rem .35rem;
    border-radius: 4px;
    font-family: 'SF Mono', monospace;
    color: #1d1d1f;
}

.output {
    background: #f0f0f5;
    border-radius: 8px;
    padding: .75rem 1rem;
    font-family: 'SF Mono', monospace;
    font-size: .8rem;
    color: #1d1d1f;
    white-space: pre-wrap;
}
</style>
