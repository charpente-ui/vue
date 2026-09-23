// The library never runs on Node and does not depend on @types/node: this is
// only the variable a bundler replaces, which is what drops the development
// warnings from a production build. Not part of the published types.
declare const process: { env: { NODE_ENV?: string } };
