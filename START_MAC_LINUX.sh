#!/usr/bin/env sh
if ! command -v npx >/dev/null 2>&1; then
  echo "Node.js is not installed. Install it from https://nodejs.org/"
  exit 1
fi
npx serve .
