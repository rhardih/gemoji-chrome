#!/usr/bin/env bash

echo "var images = [" > images.js

ls emoji/ | grep png | sed "s/.png$//" | sed "s/^/  { name: \"/g" | sed "s/$/\", element: undefined },/g" >> images.js

sed -i "" -e '$s/,$//' images.js

echo "];" >> images.js
