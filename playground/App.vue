<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
const fieldWrapperRef = ref<HTMLDivElement | null>(null);
const fieldInputId = ref('');
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

const nameFieldRef = ref<InstanceType<typeof CField> | null>(null);
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

onMounted(() => {
    fieldInputId.value = fieldWrapperRef.value?.querySelector('input')?.id ?? '';
});

const tabs = [
    { id: 'primitives',
        label: 'Primitives' },
    { id: 'composition',
        label: 'Composition' }
] as const;
const activeTab = ref<typeof tabs[number]['id']>('primitives');
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

        <nav class="tabs">
            <button v-for="tab in tabs"
                    :key="tab.id"
                    type="button"
                    class="tab"
                    :class="{ 'tab--active': activeTab === tab.id }"
                    @click="activeTab = tab.id">
                {{ tab.label }}
            </button>
        </nav>

        <main v-show="activeTab === 'primitives'" class="sections">
            <div class="group">
                <h3 class="group-title">Actions</h3>
                <div class="group-cards">
                    <section class="card">
                        <h2>CButton</h2>
                        <div class="row">
                            <CButton>Button</CButton>
                            <CButton as="a" href="#">As link</CButton>
                        </div>
                        <p class="value">Defaults to <code>type="button"</code> — no accidental form submits.</p>
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CButton</span><span class="punc">&gt;</span>Button<span class="punc">&lt;/</span><span class="tag">CButton</span><span class="punc">&gt;</span>
<span class="punc">&lt;</span><span class="tag">CButton</span> <span class="attr">as</span><span class="punc">=</span><span class="str">&quot;a&quot;</span> <span class="attr">href</span><span class="punc">=</span><span class="str">&quot;/link&quot;</span><span class="punc">&gt;</span>As link<span class="punc">&lt;/</span><span class="tag">CButton</span><span class="punc">&gt;</span></code></pre>
                        </div>
                    </section>
                </div>
            </div>

            <div class="group">
                <h3 class="group-title">Text entry</h3>
                <div class="group-cards">
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
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Text<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CInput</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;text&quot;</span> <span class="attr">placeholder</span><span class="punc">=</span><span class="str">&quot;Type something...&quot;</span><span class="punc">/&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span></code></pre>
                        </div>
                    </section>

                    <section class="card">
                        <h2>CTextarea</h2>
                        <CField class="field">
                            <CLabel>Message</CLabel>
                            <CTextarea v-model="textarea" placeholder="Type something..."/>
                        </CField>
                        <p class="value">Value: <code>{{ textarea }}</code></p>
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Message<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CTextarea</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;message&quot;</span><span class="punc">/&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span></code></pre>
                        </div>
                    </section>
                </div>
            </div>

            <div class="group">
                <h3 class="group-title">Checkbox</h3>
                <div class="group-cards">
                    <section class="card">
                        <h2>CCheckbox</h2>
                        <CField class="check-row">
                            <CCheckbox v-model="checkbox"/>
                            <CLabel>Single checkbox</CLabel>
                        </CField>
                        <p class="value">Value: <code>{{ checkbox }}</code></p>
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CCheckbox</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;checked&quot;</span><span class="punc">/&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Single checkbox<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span></code></pre>
                        </div>
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
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CCheckboxGroup</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;selected&quot;</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CCheckbox</span> <span class="attr">value</span><span class="punc">=</span><span class="str">&quot;a&quot;</span><span class="punc">/&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Option A<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CCheckbox</span> <span class="attr">value</span><span class="punc">=</span><span class="str">&quot;b&quot;</span><span class="punc">/&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Option B<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CCheckboxGroup</span><span class="punc">&gt;</span></code></pre>
                        </div>
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
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CCheckbox</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;allSelected&quot;</span> <span class="attr">:indeterminate</span><span class="punc">=</span><span class="str">&quot;someSelected&quot;</span><span class="punc">/&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Select all<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span></code></pre>
                        </div>
                    </section>
                </div>
            </div>

            <div class="group">
                <h3 class="group-title">Radio</h3>
                <div class="group-cards">
                    <section class="card">
                        <h2>CRadio</h2>
                        <CField v-for="opt in ['a', 'b', 'c']" :key="opt" class="check-row">
                            <CRadio v-model="radioStandalone" :value="opt" name="standalone-group"/>
                            <CLabel>Option {{ opt.toUpperCase() }}</CLabel>
                        </CField>
                        <p class="value">Value: <code>{{ radioStandalone }}</code></p>
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CRadio</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;choice&quot;</span> <span class="attr">value</span><span class="punc">=</span><span class="str">&quot;a&quot;</span> <span class="attr">name</span><span class="punc">=</span><span class="str">&quot;group&quot;</span><span class="punc">/&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Option A<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span></code></pre>
                        </div>
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
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CRadioGroup</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;choice&quot;</span> <span class="attr">name</span><span class="punc">=</span><span class="str">&quot;group&quot;</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CRadio</span> <span class="attr">value</span><span class="punc">=</span><span class="str">&quot;a&quot;</span><span class="punc">/&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Option A<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CRadio</span> <span class="attr">value</span><span class="punc">=</span><span class="str">&quot;b&quot;</span><span class="punc">/&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Option B<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CRadioGroup</span><span class="punc">&gt;</span></code></pre>
                        </div>
                    </section>
                </div>
            </div>

            <div class="group">
                <h3 class="group-title">Select</h3>
                <div class="group-cards">
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
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Pick one<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CSelect</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;value&quot;</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">option</span> <span class="attr">value</span><span class="punc">=</span><span class="str">&quot;a&quot;</span><span class="punc">&gt;</span>Option A<span class="punc">&lt;/</span><span class="tag">option</span><span class="punc">&gt;</span>
  <span class="punc">&lt;/</span><span class="tag">CSelect</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span></code></pre>
                        </div>
                    </section>
                </div>
            </div>

            <div class="group">
                <h3 class="group-title">File</h3>
                <div class="group-cards">
                    <section class="card">
                        <h2>CFile</h2>
                        <CField class="field">
                            <CLabel>Upload</CLabel>
                            <CFile v-model="file"/>
                        </CField>
                        <p class="value">File: <code>{{ file?.[0]?.name ?? 'none' }}</code></p>
                        <div class="code-block">
                            <div class="code-block__header">
                                <span class="code-block__dot code-block__dot--red"/>
                                <span class="code-block__dot code-block__dot--yellow"/>
                                <span class="code-block__dot code-block__dot--green"/>
                                <span class="code-block__label">Usage</span>
                            </div>
                            <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Upload<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CFile</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;file&quot;</span><span class="punc">/&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span></code></pre>
                        </div>
                    </section>
                </div>
            </div>
        </main>

        <main v-show="activeTab === 'composition'" class="sections">
            <section class="card">
                <h2>CField</h2>
                <div ref="fieldWrapperRef">
                    <CField class="field">
                        <CLabel>Auto-linked label</CLabel>
                        <CInput v-model="fieldText" placeholder="Click the label to focus me..."/>
                        <CSupportingText class="value">
                            Supporting text — wired to the input via <code>aria-describedby</code>.
                        </CSupportingText>
                    </CField>
                </div>
                <p class="value">No <code>for</code>/<code>id</code> written — the field links them automatically.</p>
                <p class="value">
                    Generated id: <code>{{ fieldInputId }}</code> — namespaced with a <code>cui-</code> prefix so it
                    never collides with an id from your app or another library.
                </p>
                <div class="code-block">
                    <div class="code-block__header">
                        <span class="code-block__dot code-block__dot--red"/>
                        <span class="code-block__dot code-block__dot--yellow"/>
                        <span class="code-block__dot code-block__dot--green"/>
                        <span class="code-block__label">Usage</span>
                    </div>
                    <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Label<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CInput</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;value&quot;</span><span class="punc">/&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CSupportingText</span><span class="punc">&gt;</span>
    Supporting text, linked via aria-describedby.
  <span class="punc">&lt;/</span><span class="tag">CSupportingText</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span></code></pre>
                </div>
            </section>

            <section class="card">
                <h2>CForm — native validation</h2>
                <CForm validate @submit="onSubmit">
                    <CField ref="nameFieldRef" class="field" :class="{ 'is-invalid': nameFieldRef?.invalid }">
                        <CLabel>Name *</CLabel>
                        <CInput v-model="form.name" placeholder="John Doe" required/>
                        <CSupportingText validation class="value">
                            Your full name, as it should appear.
                        </CSupportingText>
                    </CField>
                    <CField v-slot="{ invalid }" class="field">
                        <CLabel>Email *</CLabel>
                        <CInput v-model="form.email" type="email" placeholder="john@example.com" required
                                :class="{ 'is-invalid': invalid }"/>
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
                <div class="code-block">
                    <div class="code-block__header">
                        <span class="code-block__dot code-block__dot--red"/>
                        <span class="code-block__dot code-block__dot--yellow"/>
                        <span class="code-block__dot code-block__dot--green"/>
                        <span class="code-block__label">Usage</span>
                    </div>
                    <pre class="snippet"><code v-pre><span class="punc">&lt;</span><span class="tag">CForm</span> <span class="attr">validate</span> <span class="attr">@submit</span><span class="punc">=</span><span class="str">&quot;onSubmit&quot;</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CField</span> <span class="attr">ref</span><span class="punc">=</span><span class="str">&quot;nameFieldRef&quot;</span>
    <span class="attr">:class</span><span class="punc">=</span><span class="str">&quot;{ 'is-invalid': nameFieldRef?.invalid }&quot;</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Name *<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CInput</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;form.name&quot;</span> <span class="attr">required</span><span class="punc">/&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CSupportingText</span> <span class="attr">validation</span><span class="punc">&gt;</span>
      Your full name, as it should appear.
    <span class="punc">&lt;/</span><span class="tag">CSupportingText</span><span class="punc">&gt;</span>
  <span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CField</span> <span class="attr">v-slot</span><span class="punc">=</span><span class="str">&quot;{ invalid }&quot;</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>Email *<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CInput</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;form.email&quot;</span> <span class="attr">type</span><span class="punc">=</span><span class="str">&quot;email&quot;</span> <span class="attr">required</span>
      <span class="attr">:class</span><span class="punc">=</span><span class="str">&quot;{ 'is-invalid': invalid }&quot;</span><span class="punc">/&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CSupportingText</span> <span class="attr">validation</span><span class="punc">&gt;</span>
      We never share your email.
    <span class="punc">&lt;/</span><span class="tag">CSupportingText</span><span class="punc">&gt;</span>
  <span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CField</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">div</span><span class="punc">&gt;</span>
      <span class="punc">&lt;</span><span class="tag">CCheckbox</span> <span class="attr">v-model</span><span class="punc">=</span><span class="str">&quot;form.terms&quot;</span> <span class="attr">required</span><span class="punc">/&gt;</span>
      <span class="punc">&lt;</span><span class="tag">CLabel</span><span class="punc">&gt;</span>I accept the terms<span class="punc">&lt;/</span><span class="tag">CLabel</span><span class="punc">&gt;</span>
    <span class="punc">&lt;/</span><span class="tag">div</span><span class="punc">&gt;</span>
    <span class="punc">&lt;</span><span class="tag">CSupportingText</span> <span class="attr">validation</span><span class="punc">&gt;</span>
      Required before submitting.
    <span class="punc">&lt;/</span><span class="tag">CSupportingText</span><span class="punc">&gt;</span>
  <span class="punc">&lt;/</span><span class="tag">CField</span><span class="punc">&gt;</span>
  <span class="punc">&lt;</span><span class="tag">CButton</span> <span class="attr">type</span><span class="punc">=</span><span class="str">&quot;submit&quot;</span><span class="punc">&gt;</span>Submit<span class="punc">&lt;/</span><span class="tag">CButton</span><span class="punc">&gt;</span>
<span class="punc">&lt;/</span><span class="tag">CForm</span><span class="punc">&gt;</span></code></pre>
                </div>
            </section>
        </main>
    </div>
</template>

<style>
:root {
    color-scheme: light dark;

    --bg: #f5f5f7;
    --bg-card: #fff;
    --border: #e5e5ea;
    --border-subtle: #f0f0f5;
    --text: #1d1d1f;
    --text-muted: #6e6e73;
    --accent: #0071e3;
    --accent-text: #fff;
    --notice-bg: #fff8e6;
    --notice-border: #f5c842;
    --notice-text: #7a5c00;
    --code-bg: #f0f0f5;
    --shadow: 0 1px 3px rgba(0, 0, 0, .06), 0 1px 2px rgba(0, 0, 0, .04);
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg: #000;
        --bg-card: #1c1c1e;
        --border: #2c2c2e;
        --border-subtle: #2c2c2e;
        --text: #f5f5f7;
        --text-muted: #98989d;
        --accent: #0a84ff;
        --accent-text: #fff;
        --notice-bg: #2b2410;
        --notice-border: #6b551a;
        --notice-text: #f5c842;
        --code-bg: #2c2c2e;
        --shadow: 0 1px 3px rgba(0, 0, 0, .4), 0 1px 2px rgba(0, 0, 0, .3);
    }
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 15px;
    line-height: 1.5;
}

.layout {
    max-width: 680px;
    margin: 0 auto;
    padding: clamp(1.5rem, 4vw, 3rem) 1.25rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.header h1 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: .6rem;
    letter-spacing: -.02em;
}

.badge {
    font-size: .7rem;
    font-weight: 600;
    background: var(--accent);
    color: var(--accent-text);
    padding: .2rem .55rem;
    border-radius: 999px;
    letter-spacing: .03em;
}

.subtitle {
    color: var(--text-muted);
    margin-top: .3rem;
    font-size: .95rem;
}

.notice {
    background: var(--notice-bg);
    border: 1.5px solid var(--notice-border);
    border-radius: 10px;
    padding: .75rem 1rem;
    font-size: .875rem;
    color: var(--notice-text);
    line-height: 1.5;
}

.tabs {
    display: flex;
    gap: .25rem;
    border-bottom: 1px solid var(--border);
}

.tab {
    appearance: none;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    font-size: .875rem;
    color: var(--text-muted);
    padding: .6rem .9rem;
    border-radius: 8px 8px 0 0;
    margin-bottom: -1px;
    border-bottom: 2px solid transparent;
    transition: color .15s ease, border-color .15s ease;
}

.tab:hover {
    color: var(--text);
}

.tab--active {
    color: var(--accent);
    border-bottom-color: var(--accent);
}

.sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.group {
    display: flex;
    flex-direction: column;
    gap: .9rem;
}

.group-title {
    font-size: .7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--text-muted);
}

.group-cards {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.5rem 1.75rem;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    gap: .75rem;
    transition: border-color .15s ease, box-shadow .15s ease;
}

.card:hover {
    border-color: var(--accent);
}

.card h2 {
    font-size: .8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: .5rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: .3rem;
}

.field.is-invalid {
    padding-left: .5rem;
    border-left: 2px solid #ff3b30;
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
    flex-wrap: wrap;
}

.value {
    font-size: .8rem;
    color: var(--text-muted);
}

.value code {
    background: var(--code-bg);
    padding: .1rem .35rem;
    border-radius: 4px;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    color: var(--text);
}

.is-invalid {
    border-color: #ff3b30 !important;
}

.output {
    background: var(--code-bg);
    border-radius: 8px;
    padding: .75rem 1rem;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: .8rem;
    color: var(--text);
    white-space: pre-wrap;
}

.code-block {
    background: #1d1d1f;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--shadow);
    margin-top: .25rem;
}

.code-block__header {
    display: flex;
    align-items: center;
    gap: .4rem;
    padding: .55rem .75rem;
    background: #2c2c2e;
    border-bottom: 1px solid #000;
}

.code-block__dot {
    width: .65rem;
    height: .65rem;
    border-radius: 50%;
}

.code-block__dot--red { background: #ff5f57; }
.code-block__dot--yellow { background: #febc2e; }
.code-block__dot--green { background: #28c840; }

.code-block__label {
    margin-left: .4rem;
    font-size: .7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #8e8e93;
}

.snippet {
    margin: 0;
    padding: .9rem 1.1rem;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: .78rem;
    line-height: 1.6;
    color: #d4d4d4;
    white-space: pre;
    overflow-x: auto;
}

.snippet .punc { color: #808080; }
.snippet .tag { color: #4ec9b0; }
.snippet .attr { color: #9cdcfe; }
.snippet .str { color: #ce9178; }
</style>
