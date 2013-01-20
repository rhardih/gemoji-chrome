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

pushd gemoji/images
zip -r ../../gemoji-chrome.zip emoji
popd

popd

mv tmp/gemoji-chrome.zip .
rm -rf tmp
