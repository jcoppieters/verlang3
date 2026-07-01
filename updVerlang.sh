#!/bin/bash
pushd /etc/nodejs/verlang3/
git pull
git reset --hard origin/main
rm -rf node_modules
npm install
npm run build
pm2 restart verlang
popd
