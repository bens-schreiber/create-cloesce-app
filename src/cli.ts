#!/usr/bin/env node

import { create } from 'create-create-app';
import { resolve } from 'path';

const templateRoot = resolve(__dirname, '..', 'templates');

const caveat = `
To get started with your new Cloesce project run:
- "npm run build"
- "npm run migrate"
- "npm run start:dev"
- "npm run start:web"
`

create('create-cloesce', {
  templateRoot,
  promptForLicense: false,
  promptForDescription: false,
  promptForEmail: false,
  promptForAuthor: false,
  skipNpmInstall: true,
  defaultLicense: "UNLICENSED",
  after: async ({ installNpmPackage }) => {
    await installNpmPackage('cloesce wrangler');
    await installNpmPackage('@cloudflare/workers-types miniflare vite-tsconfig-paths vitest typescript', true);
  },
  caveat
});
