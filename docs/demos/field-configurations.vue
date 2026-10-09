<script setup lang="ts">
import { ref } from 'vue';
import { CCheckbox, CCheckboxGroup, CField, CLabel, CRadio, CRadioGroup, CSupportingText } from '@charpente-ui/vue';

const terms = ref(false);
const darkMode = ref(false);
const plan = ref('free');
const channels = ref<string[]>([]);
</script>

<template>
    <div class="stack">
        <CField class="choice">
            <CCheckbox v-model="terms"/>
            <CLabel>I accept the terms</CLabel>
        </CField>

        <!-- A switch is a checkbox with a role. -->
        <CField class="choice">
            <CCheckbox v-model="darkMode" role="switch"/>
            <CLabel>Dark mode</CLabel>
        </CField>

        <!-- A list: the legend on top, the items, the hint at the bottom. -->
        <CField>
            <CRadioGroup v-model="plan" class="group">
                <legend>Plan</legend>

                <CField class="choice">
                    <CRadio value="free"/>
                    <CLabel>Free</CLabel>
                </CField>

                <CField class="choice">
                    <CRadio value="pro"/>
                    <CLabel>Pro</CLabel>
                </CField>

                <CSupportingText>Change it whenever you want.</CSupportingText>
            </CRadioGroup>
        </CField>

        <CField>
            <CCheckboxGroup v-model="channels" class="group">
                <legend>Notifications</legend>

                <CField class="choice">
                    <CCheckbox value="email"/>
                    <CLabel>Email</CLabel>
                </CField>

                <CField class="choice">
                    <CCheckbox value="sms"/>
                    <CLabel>SMS</CLabel>
                </CField>

                <CSupportingText>Pick at least one channel.</CSupportingText>
            </CCheckboxGroup>
        </CField>
    </div>
</template>

<style scoped>
/* The library ships no CSS: this layout is yours. */
.stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* A <fieldset> comes with a border and padding from the browser. */
.group {
    display: flex;
    flex-direction: column;
    gap: .25rem;
    border: 0;
    margin: 0;
    padding: 0;
}

/* Control and label side by side, the hint under the label. */
.stack .choice {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0 .5rem;
}

.stack .choice > :nth-child(n + 3) {
    grid-column: 2;
}
</style>
