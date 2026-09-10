<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useData } from 'vitepress';

// Isometric pixel-stack animation for the home hero. Ported from a standalone prototype: same
// drawing logic, but theme now follows the site's own dark-mode toggle instead of the OS media
// query, and the body-background side effect is dropped — the hero already paints its own
// background, the canvas only needs to stay transparent.
const canvasEl = ref<HTMLCanvasElement | null>(null);
const { isDark } = useData();

interface ThemeColors {
    r: number;
    g: number;
    b: number;
}

interface ThemeConfig {
    fallingStart: ThemeColors;
    fallingFinal: ThemeColors;
    base3d: { top: string;
        left: string;
        right: string };
    grainBlendMode: GlobalCompositeOperation;
}

const THEMES: Record<'dark' | 'light', ThemeConfig> = {
    dark: {
        fallingStart: { r: 148,
            g: 163,
            b: 184 },
        fallingFinal: { r: 226,
            g: 232,
            b: 240 },
        base3d: { top: '#24242e',
            left: '#14141a',
            right: '#0d0d12' },
        grainBlendMode: 'overlay'
    },
    light: {
        fallingStart: { r: 100,
            g: 116,
            b: 139 },
        fallingFinal: { r: 30,
            g: 41,
            b: 59 },
        base3d: { top: '#ffffff',
            left: '#cbd5e1',
            right: '#94a3b8' },
        grainBlendMode: 'multiply'
    }
};

let currentThemeKey: 'dark' | 'light' = isDark.value ? 'dark' : 'light';

watch(isDark, (value) => {
    currentThemeKey = value ? 'dark' : 'light';
});

const darkConfigs: Record<number, { delay: number;
    duration: number;
    label: string }> = {
    1: { delay: 0,
        duration: 3200,
        label: 'input' },
    7: { delay: 1000,
        duration: 3000,
        label: 'select' },
    3: { delay: 2200,
        duration: 3100,
        label: 'radio' },
    5: { delay: 3200,
        duration: 2900,
        label: 'button' }
};

const HOLD_TIME = 1200;
const FADE_OUT_TIME = 800;
const ANIM_END_TIME = 3200 + 2900;
const TOTAL_CYCLE_DURATION = ANIM_END_TIME + HOLD_TIME + FADE_OUT_TIME;

const rects = [
    { x: 0,
        y: 0,
        isDark: false },
    { x: 16,
        y: 0,
        isDark: true },
    { x: 32,
        y: 0,
        isDark: false },
    { x: 0,
        y: 16,
        isDark: true },
    { x: 16,
        y: 16,
        isDark: false },
    { x: 32,
        y: 16,
        isDark: true },
    { x: 0,
        y: 32,
        isDark: false },
    { x: 16,
        y: 32,
        isDark: true },
    { x: 32,
        y: 32,
        isDark: false }
];

const COLOR_BASE = '#b84277';

const SCALE = 4;
const SIZE = 12 * SCALE;
const RADIUS = 2 * SCALE;
const OFFSET = (44 * SCALE) / 2;

const BASE_PADDING = 8;
const BASE_SIZE = (44 * SCALE) + (BASE_PADDING * 2);
const BASE_OFFSET = BASE_SIZE / 2;
const BASE_RADIUS = 4 * SCALE;
const BASE_HEIGHT_3D = 18;

const DROP_OFFSET_Y = -320;

// Slow, progressive grow-in curve.
function easeOutSine(t: number): number {
    return Math.sin((t * Math.PI) / 2);
}

// Smooth drop-in curve.
function easeInQuad(t: number): number {
    return t * t;
}

function interpolateColor(colorA: ThemeColors, colorB: ThemeColors, factor: number): string {
    const r = Math.round(colorA.r + factor * (colorB.r - colorA.r));
    const g = Math.round(colorA.g + factor * (colorB.g - colorA.g));
    const b = Math.round(colorA.b + factor * (colorB.b - colorA.b));
    return `rgb(${r}, ${g}, ${b})`;
}

function createNoiseCanvas(width: number, height: number, opacity = 0.25): HTMLCanvasElement {
    const nCanvas = document.createElement('canvas');
    nCanvas.width = width;
    nCanvas.height = height;

    const nCtx = nCanvas.getContext('2d')!;
    const imgData = nCtx.createImageData(width, height);
    const buffer = new Uint32Array(imgData.data.buffer);

    for (let i = 0; i < buffer.length; i++) {
        const v = (Math.random() * 255) | 0;
        const alpha = (Math.random() * 255 * opacity) | 0;
        buffer[i] = (alpha << 24) | (v << 16) | (v << 8) | v;
    }

    nCtx.putImageData(imgData, 0, 0);
    return nCanvas;
}

let rafId = 0;

onMounted(() => {
    const canvas = canvasEl.value;
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d')!;
    const grainTexture = createNoiseCanvas(200, 200, 0.25);
    const targetBaseY = canvas.height * 0.72;

    function draw3DPedestal(theme: ThemeConfig) {
        // 3D sides
        for (let h = BASE_HEIGHT_3D; h > 0; h--) {
            ctx.save();
            ctx.translate(canvas!.width / 2, targetBaseY + h);
            ctx.scale(1, 0.5);
            ctx.rotate(-Math.PI / 4);

            ctx.fillStyle = h > BASE_HEIGHT_3D / 2 ? theme.base3d.right : theme.base3d.left;
            ctx.beginPath();
            ctx.roundRect(-BASE_OFFSET, -BASE_OFFSET, BASE_SIZE, BASE_SIZE, BASE_RADIUS);
            ctx.fill();
            ctx.restore();
        }

        // Bottom base outline
        ctx.save();
        ctx.translate(canvas!.width / 2, targetBaseY + BASE_HEIGHT_3D);
        ctx.scale(1, 0.5);
        ctx.rotate(-Math.PI / 4);
        ctx.beginPath();
        ctx.roundRect(-BASE_OFFSET, -BASE_OFFSET, BASE_SIZE, BASE_SIZE, BASE_RADIUS);
        ctx.strokeStyle = COLOR_BASE;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Top plate
        ctx.save();
        ctx.translate(canvas!.width / 2, targetBaseY);
        ctx.scale(1, 0.5);
        ctx.rotate(-Math.PI / 4);

        ctx.beginPath();
        ctx.roundRect(-BASE_OFFSET, -BASE_OFFSET, BASE_SIZE, BASE_SIZE, BASE_RADIUS);
        ctx.fillStyle = theme.base3d.top;
        ctx.fill();

        // Grain texture
        ctx.save();
        ctx.clip();
        ctx.globalCompositeOperation = theme.grainBlendMode;
        ctx.drawImage(grainTexture, -BASE_OFFSET, -BASE_OFFSET, BASE_SIZE, BASE_SIZE);
        ctx.restore();

        // Top plate outline
        ctx.strokeStyle = COLOR_BASE;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    function animate(time: number) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);

        const theme = THEMES[currentThemeKey];

        draw3DPedestal(theme);

        const cycleTime = time % TOTAL_CYCLE_DURATION;

        let globalFadeOut = 1;
        const fadeOutStartTime = ANIM_END_TIME + HOLD_TIME;

        if (cycleTime > fadeOutStartTime) {
            const fadeProgress = (cycleTime - fadeOutStartTime) / FADE_OUT_TIME;
            globalFadeOut = Math.max(0, 1 - fadeProgress);
        }

        rects.forEach((r, i) => {
            let offsetY = 0;
            let fadeAlpha = 1;
            let strokeColor = COLOR_BASE;
            let label: string | null = null;
            let growthScale = 1;

            if (r.isDark) {
                const config = darkConfigs[i];
                label = config.label;
                const elapsedTime = Math.max(0, cycleTime - config.delay);
                const progress = Math.min(1, elapsedTime / config.duration);

                if (elapsedTime === 0) {
                    fadeAlpha = 0;
                    growthScale = 0;
                    offsetY = DROP_OFFSET_Y;
                } else {
                    // Grow-in spread and slowed over the start of the movement.
                    const scaleProgress = Math.min(1, progress / 0.5);
                    growthScale = easeOutSine(scaleProgress);

                    fadeAlpha = Math.min(1, scaleProgress * 1.5) * globalFadeOut;

                    // Progressive drop.
                    const dropProgress = easeInQuad(progress);
                    offsetY = DROP_OFFSET_Y * (1 - dropProgress);

                    strokeColor = interpolateColor(theme.fallingStart, theme.fallingFinal, dropProgress);
                }
            }

            if (fadeAlpha > 0) {
                ctx.save();
                ctx.translate(canvas!.width / 2, targetBaseY + offsetY - 2);

                ctx.scale(growthScale, 0.5 * growthScale);
                ctx.rotate(-Math.PI / 4);

                ctx.globalAlpha = fadeAlpha;

                const rectX = r.x * SCALE - OFFSET;
                const rectY = r.y * SCALE - OFFSET;

                ctx.beginPath();
                ctx.roundRect(rectX, rectY, SIZE, SIZE, RADIUS);

                if (r.isDark) {
                    ctx.strokeStyle = strokeColor;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();

                    if (label) {
                        ctx.save();
                        ctx.fillStyle = strokeColor;
                        ctx.font = '600 11px system-ui, -apple-system, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';

                        const centerX = rectX + SIZE / 2;
                        const centerY = rectY + SIZE / 2;

                        ctx.fillText(label, centerX, centerY);
                        ctx.restore();
                    }
                } else {
                    ctx.fillStyle = COLOR_BASE;
                    ctx.fill();
                }

                ctx.restore();
            }
        });

        rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
});

onUnmounted(() => {
    cancelAnimationFrame(rafId);
});
</script>

<template>
    <canvas ref="canvasEl"
            class="hero-canvas"
            width="500"
            height="500"
            aria-hidden="true"/>
</template>

<style scoped>
.hero-canvas {
    display: block;
    width: 100%;
    max-width: 500px;
    height: auto;
}
</style>
