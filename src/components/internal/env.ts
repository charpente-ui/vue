// Bundlers replace `process.env.NODE_ENV` statically, so the check stays
// tree-shakable. Loaded without a bundler (import map, CDN ESM) `process`
// does not exist: no crash, and no development warnings.
export function isDev(): boolean {
    try {
        return process.env.NODE_ENV !== 'production';
    } catch {
        return false;
    }
}
