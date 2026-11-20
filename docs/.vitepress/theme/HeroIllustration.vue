<template>
    <svg class="hero-illustration"
         viewBox="55 40 330 365"
         fill="none"
         aria-hidden="true"
         focusable="false">
        <!-- Back sheet -->
        <rect x="98" y="108" width="232" height="272" rx="8"
              fill="var(--vp-c-bg-alt)"
              stroke="var(--vp-c-divider)"
              stroke-width="1.5"
              transform="rotate(-5 220 220)"/>

        <!-- Middle sheet -->
        <rect x="94" y="94" width="232" height="272" rx="8"
              fill="var(--vp-c-bg-soft)"
              stroke="var(--vp-c-divider)"
              stroke-width="1.5"
              transform="rotate(3 220 220)"/>

        <!-- Front sheet: a form -->
        <rect x="90" y="80" width="232" height="272" rx="8"
              fill="var(--vp-c-bg)"
              stroke="var(--vp-c-border, var(--vp-c-divider))"
              stroke-width="1.5"/>

        <!-- Field 1: label bar, input with caret, hint hairline -->
        <rect x="116" y="110" width="56" height="8" rx="4" fill="var(--vp-c-text-1)"/>
        <rect x="116" y="128" width="172" height="32" rx="6"
              stroke="var(--vp-c-text-3)"
              stroke-width="1.5"/>
        <line class="caret"
              x1="130" y1="137" x2="130" y2="151"
              stroke="var(--vp-c-brand-1)"
              stroke-width="2"/>
        <line x1="116" y1="176" x2="236" y2="176" stroke="var(--vp-c-text-3)" stroke-width="1.5"/>

        <!-- Wiring: label, input and hint are linked -->
        <g stroke="var(--vp-c-brand-1)">
            <line x1="104" y1="114" x2="104" y2="176" stroke-width="1.2" stroke-dasharray="2 3"/>
            <g stroke-width="1.2">
                <line x1="104" y1="114" x2="112" y2="114"/>
                <line x1="104" y1="144" x2="112" y2="144"/>
                <line x1="104" y1="176" x2="112" y2="176"/>
            </g>
        </g>
        <g fill="var(--vp-c-brand-1)">
            <circle cx="104" cy="114" r="2.5"/>
            <circle cx="104" cy="144" r="2.5"/>
            <circle cx="104" cy="176" r="2.5"/>
        </g>

        <!-- Field 2: checked checkbox and its label -->
        <rect x="116" y="204" width="16" height="16" rx="4" fill="var(--vp-c-brand-1)"/>
        <!-- White on brand pink is intentional -->
        <polyline points="120 212 123.5 215.5 128.5 208.5"
                  stroke="#fff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
        <line x1="142" y1="212" x2="232" y2="212" stroke="var(--vp-c-text-2)" stroke-width="1.5"/>

        <!-- Button -->
        <rect x="116" y="240" width="88" height="30" rx="6" fill="var(--vp-c-text-1)"/>
        <line x1="136" y1="255" x2="184" y2="255" stroke="var(--vp-c-bg)" stroke-width="1.5"/>

        <!-- Colophon: rule, logo grid mark and folio number -->
        <line x1="116" y1="316" x2="296" y2="316" stroke="var(--vp-c-divider)" stroke-width="1"/>
        <g fill="var(--vp-c-brand-1)">
            <rect x="116" y="324" width="6" height="6" rx="1"/>
            <rect x="124" y="324" width="6" height="6" rx="1" opacity="0.4"/>
            <rect x="132" y="324" width="6" height="6" rx="1"/>
            <rect x="116" y="332" width="6" height="6" rx="1" opacity="0.4"/>
            <rect x="124" y="332" width="6" height="6" rx="1"/>
            <rect x="132" y="332" width="6" height="6" rx="1" opacity="0.4"/>
            <rect x="116" y="340" width="6" height="6" rx="1"/>
            <rect x="124" y="340" width="6" height="6" rx="1" opacity="0.4"/>
            <rect x="132" y="340" width="6" height="6" rx="1"/>
        </g>
        <text x="296" y="341"
              text-anchor="end"
              font-family="var(--vp-font-family-mono, ui-monospace, monospace)"
              font-size="22"
              fill="var(--vp-c-text-3)">01</text>
    </svg>
</template>

<style scoped>
.hero-illustration {
    display: block;
    width: 100%;
    max-width: 420px;
    height: auto;
}

.caret {
    animation: blink 1.1s steps(1) infinite;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .caret {
        animation: none;
    }
}
</style>
