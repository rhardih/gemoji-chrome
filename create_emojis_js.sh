#!/usr/bin/env bash

echo "var emojis = [" > emojis.js

ls gemoji/images/emoji/ | grep png | sed "s/.png$//" | sed "s/^/  { name: \"/g" | sed "s/$/\", element: undefined },/g" >> emojis.js

sed -i "" -e '$s/,$//' emojis.js

echo "];" >> emojis.js
