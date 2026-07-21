<script setup lang="ts">
import { computed, ref } from 'vue';
import { CButton,
    CCheckbox,
    CCheckboxGroup,
    CField,
    CFile,
    CForm,
    CInput,
    CLabel,
    CRadio,
    CRadioGroup,
    CSelect,
    CSupportingText,
    CTextarea } from '@charpente-ui/vue';

const text = ref('');
const number = ref(0);
const lazyText = ref('');
const fieldText = ref('');
const textarea = ref('');
const checkbox = ref(false);
const checkboxGroup = ref<string[]>([]);
const radioStandalone = ref('');
const radio = ref('');
const select = ref('');
const selectMultiple = ref<string[]>([]);
const file = ref<FileList | null>(null);

const allFruits = ['apple',
    'banana',
    'cherry'];
const fruits = ref<string[]>([]);

const allSelected = computed({
    get: () => fruits.value.length === allFruits.length,
    set: (checked) => {
        fruits.value = checked ? [...allFruits] : [];
    }
});

const someSelected = computed(() => {
    return fruits.value.length > 0 && fruits.value.length < allFruits.length;
});

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
                    <CButton>Button</CButton>
                    <CButton as="a" href="#">As link</CButton>
                </div>
                <p class="value">Defaults to <code>type="button"</code> — no accidental form submits.</p>
            </section>

            <section class="card">
                <h2>CField</h2>
                <CField class="field">
                    <CLabel>Auto-linked label</CLabel>
                    <CInput v-model="fieldText" placeholder="Click the label to focus me..."/>
                    <CSupportingText class="value">
                        Supporting text — wired to the input via <code>aria-describedby</code>.
                    </CSupportingText>
                </CField>
                <p class="value">No <code>for</code>/<code>id</code> written — the field links them automatically.</p>
            </section>

            <section class="card">
                <h2>CInput</h2>
                <CField class="field">
                    <CLabel>Text</CLabel>
                    <CInput v-model="text" placeholder="Type something..."/>
                </CField>
                <CField class="field">
                    <CLabel>Number</CLabel>
                    <CInput v-model="number" type="number"/>
                </CField>
                <CField class="field">
                    <CLabel>Lazy (updates on blur/enter)</CLabel>
                    <CInput v-model.lazy="lazyText" placeholder="Type, then blur..."/>
                </CField>
                <p class="value">Text: <code>{{ text }}</code></p>
                <p class="value">Number: <code>{{ number }}</code></p>
                <p class="value">Lazy: <code>{{ lazyText }}</code></p>
            </section>

            <section class="card">
                <h2>CTextarea</h2>
                <CField class="field">
                    <CLabel>Message</CLabel>
                    <CTextarea v-model="textarea" placeholder="Type something..."/>
                </CField>
                <p class="value">Value: <code>{{ textarea }}</code></p>
            </section>

            <section class="card">
                <h2>CCheckbox</h2>
                <CField class="check-row">
                    <CCheckbox v-model="checkbox"/>
                    <CLabel>Single checkbox</CLabel>
                </CField>
                <p class="value">Value: <code>{{ checkbox }}</code></p>
            </section>

            <section class="card">
                <h2>CCheckboxGroup</h2>
                <CCheckboxGroup v-model="checkboxGroup">
                    <CField v-for="opt in ['a', 'b', 'c']" :key="opt" class="check-row">
                        <CCheckbox :value="opt"/>
                        <CLabel>Option {{ opt.toUpperCase() }}</CLabel>
                    </CField>
                </CCheckboxGroup>
                <p class="value">Value: <code>{{ checkboxGroup }}</code></p>
            </section>

            <section class="card">
                <h2>CCheckbox — indeterminate</h2>
                <CField class="check-row">
                    <CCheckbox v-model="allSelected" :indeterminate="someSelected"/>
                    <CLabel>Select all</CLabel>
                </CField>
                <CCheckboxGroup v-model="fruits" class="sub-group">
                    <CField v-for="opt in allFruits" :key="opt" class="check-row">
                        <CCheckbox :value="opt"/>
                        <CLabel>{{ opt }}</CLabel>
                    </CField>
                </CCheckboxGroup>
                <p class="value">Value: <code>{{ fruits }}</code></p>
            </section>

            <section class="card">
                <h2>CRadio</h2>
                <CField v-for="opt in ['a', 'b', 'c']" :key="opt" class="check-row">
                    <CRadio v-model="radioStandalone" :value="opt" name="standalone-group"/>
                    <CLabel>Option {{ opt.toUpperCase() }}</CLabel>
                </CField>
                <p class="value">Value: <code>{{ radioStandalone }}</code></p>
            </section>

            <section class="card">
                <h2>CRadioGroup</h2>
                <CRadioGroup v-model="radio" name="radio-group">
                    <CField v-for="opt in ['a', 'b', 'c']" :key="opt" class="check-row">
                        <CRadio :value="opt"/>
                        <CLabel>Option {{ opt.toUpperCase() }}</CLabel>
                    </CField>
                </CRadioGroup>
                <p class="value">Value: <code>{{ radio }}</code></p>
            </section>

            <section class="card">
                <h2>CSelect</h2>
                <CField class="field">
                    <CLabel>Pick one</CLabel>
                    <CSelect v-model="select">
                        <option value="">--</option>
                        <option value="a">Option A</option>
                        <option value="b">Option B</option>
                        <option value="c">Option C</option>
                    </CSelect>
                </CField>
                <CField class="field">
                    <CLabel>Pick several</CLabel>
                    <CSelect v-model="selectMultiple" multiple>
                        <option value="a">Option A</option>
                        <option value="b">Option B</option>
                        <option value="c">Option C</option>
                    </CSelect>
                </CField>
                <p class="value">Single: <code>{{ select }}</code></p>
                <p class="value">Multiple: <code>{{ selectMultiple }}</code></p>
            </section>

            <section class="card">
                <h2>CFile</h2>
                <CField class="field">
                    <CLabel>Upload</CLabel>
                    <CFile v-model="file"/>
                </CField>
                <p class="value">File: <code>{{ file?.[0]?.name ?? 'none' }}</code></p>
            </section>

            <section class="card">
                <h2>CForm — native validation</h2>
                <CForm validate @submit="onSubmit">
                    <CField class="field">
                        <CLabel>Name *</CLabel>
                        <CInput v-model="form.name" placeholder="John Doe" required/>
                        <CSupportingText validation class="value">
                            Your full name, as it should appear.
                        </CSupportingText>
                    </CField>
                    <CField class="field">
                        <CLabel>Email *</CLabel>
                        <CInput v-model="form.email" type="email" placeholder="john@example.com" required/>
                        <CSupportingText validation class="value">
                            We never share your email.
                        </CSupportingText>
                    </CField>
                    <CField class="field">
                        <CLabel>Message</CLabel>
                        <CTextarea v-model="form.message" placeholder="Your message..." maxlength="200"/>
                        <CSupportingText validation class="value">
                            Optional — 200 characters max.
                        </CSupportingText>
                    </CField>
                    <CField class="field">
                        <div class="check-row">
                            <CCheckbox v-model="form.terms" required/>
                            <CLabel>I accept the terms</CLabel>
                        </div>
                        <CSupportingText validation class="value">
                            Required before submitting.
                        </CSupportingText>
                    </CField>
                    <div class="row">
                        <CButton type="submit">Submit</CButton>
                        <CButton type="button" @click="resetForm">Reset</CButton>
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

.sub-group {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-left: 1.25rem;
    border: none;
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
