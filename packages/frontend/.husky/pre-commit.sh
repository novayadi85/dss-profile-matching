#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npx pretty-quick --staged