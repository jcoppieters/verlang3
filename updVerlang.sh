#!/bin/bash
cd /etc/nodejs/verlang/
git pull
git reset --hard origin/main
rm -rf node_modules
npm install
pm2 restart verlang
cd ~
