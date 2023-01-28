#!/bin/ash

npm ci --omit-dev
node --es-module-specifier-resolution=node .
