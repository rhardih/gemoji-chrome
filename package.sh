#!/usr/bin/env bash

mkdir tmp
git archive HEAD --format=zip > tmp/gemoji-chrome.zip

mkdir tmp/gemoji

pushd gemoji
git checkout-index -f -a --prefix=../tmp/gemoji/
popd

pushd tmp

zip -d gemoji-chrome.zip .gitmodules
zip -d gemoji-chrome.zip emoji
zip -d gemoji-chrome.zip gemoji/
zip -d gemoji-chrome.zip README.md
zip -d gemoji-chrome.zip create_images_js.sh
zip -d gemoji-chrome.zip demo.gif

pushd gemoji/images
zip -r ../../gemoji-chrome.zip emoji
popd

popd

mv tmp/gemoji-chrome.zip .
rm -rf tmp
