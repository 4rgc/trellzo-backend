yarn check --verify-tree

if [ $? -ne 0 ]; then npm i
fi

npm run dev