#!/bin/sh
# Local pre-push check, installed by `npm install` via the "prepare" script
# (see package.json). Replaces the old CI workflow for this small project:
# runs the same checks, but on your machine before the push leaves it.
set -e

npm run lint
npm run test
npm run build
