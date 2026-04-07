#!/usr/bin/env node

import { create } from 'create-create-app';
import { resolve } from 'path';
import fs from 'fs';

const templateRoot = resolve(__dirname, '..', 'templates');

const caveat = `
Ensure cloesce has been installed (https://cloesce.pages.dev/ch1-1-installation).

To build your Cloesce project, run:
- cloesce compile
- cloesce migrate --all Initial
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
