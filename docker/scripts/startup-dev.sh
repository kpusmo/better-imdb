#!/usr/bin/env sh

npm run migration
npm run console db seed
npm run start:dev
