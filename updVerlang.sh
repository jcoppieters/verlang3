#!/bin/bash
pushd /etc/nodejs/verlang3/
git pull
git reset --hard origin/main
rm -rf node_modules
npm ci --loglevel=error
npm run build
npm prune --omit=dev --loglevel=error
pm2 restart verlang
popd
