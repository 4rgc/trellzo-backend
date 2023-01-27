#!/bin/ash

yarn check --verify-tree

if [ $? -ne 0 ]; then npm ci
fi

npm run dev
