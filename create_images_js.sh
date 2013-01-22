#!/usr/bin/env bash

echo "var images = {" > images.js

ls emoji/ | grep png | sed "s/.png$//" | sed "s/^/  \"/g" | sed "s/$/\": undefined,/g" >> images.js

sed -i -e '$s/,$//' images.js

echo "};" >> images.js
