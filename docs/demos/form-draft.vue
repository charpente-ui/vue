<script setup lang="ts">
import { ref } from 'vue';
import { CButton, CField, CForm, CInput, CLabel } from '@charpente-ui/vue';

const title = ref('');
const result = ref('');

function onSubmit(event: SubmitEvent) {
    const submitter = event.submitter as HTMLButtonElement | null;

    result.value = submitter?.formNoValidate ? 'saved as draft' : 'published';
}
</script>

<template>
    <CForm validate @submit="onSubmit">
        <CField>
            <CLabel>Title</CLabel>
            <CInput v-model="title" required/>
        </CField>

        <div class="row">
            <CButton type="submit">Publish</CButton>
            <CButton type="submit" formnovalidate>Save draft</CButton>
        </div>
    </CForm>

    <p class="value">{{ result || 'nothing submitted yet' }}</p>
</template>
