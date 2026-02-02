#!/usr/bin/env node

import { create } from 'create-create-app';
import { resolve } from 'path';
import fs from 'fs';

const templateRoot = resolve(__dirname, '..', 'templates');

const caveat = `
To build your Cloesce project, run:
- npm run build
- npm run migrate:cloesce Initial
- npm run migrate:wrangler

To start your Cloesce project in development mode, in seperate terminals, run:
- npm run start:dev
- npm run start:web
`

create('create-cloesce', {
  templateRoot,
  promptForLicense: false,
  promptForDescription: false,
  promptForEmail: false,
  defaultLicense: "UNLICENSED",
  after: async ({ packageDir }) => {
    // can't copy an empty dir because NPM lame, so create it here
    fs.mkdirSync(resolve(packageDir, 'migrations'));
  },
  caveat
});
