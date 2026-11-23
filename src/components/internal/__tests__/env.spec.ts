import { afterEach, describe, expect, it, vi } from 'vitest';
import { isDev } from '../env';

describe('isDev', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it('is true outside production', () => {
        vi.stubEnv('NODE_ENV', 'development');

        expect(isDev()).toBe(true);
    });

    it('is false in production', () => {
        vi.stubEnv('NODE_ENV', 'production');

        expect(isDev()).toBe(false);
    });

    it('is false instead of throwing when process is unavailable', () => {
        vi.stubGlobal('process', undefined);

        expect(isDev()).toBe(false);
    });
});
