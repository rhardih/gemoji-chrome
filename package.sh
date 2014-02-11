#!/usr/bin/env bash

mkdir tmp
git archive HEAD --format=zip > tmp/gemoji-chrome.zip

mkdir tmp/gemoji

pushd gemoji
git checkout-index -f -a --prefix=../tmp/gemoji/
popd

zip -r tmp/gemoji-chrome.zip stylesheets
zip tmp/gemoji-chrome.zip images/emoji-*.png

pushd tmp

zip -d gemoji-chrome.zip .gitignore
zip -d gemoji-chrome.zip .gitmodules
zip -d gemoji-chrome.zip images/emoji
zip -d gemoji-chrome.zip gemoji/
zip -d gemoji-chrome.zip README.md
zip -d gemoji-chrome.zip create_emojis_js.sh
zip -d gemoji-chrome.zip package.sh
zip -d gemoji-chrome.zip prepare_images.sh
zip -d gemoji-chrome.zip assets/demo.gif
zip -d gemoji-chrome.zip assets/chrome-store/*
zip -d gemoji-chrome.zip sass/*
zip -d gemoji-chrome.zip config.rb

popd

if [ ! -f gemoji-chrome.zip ];
then
  rm gemoji-chrome.zip
fi

mv tmp/gemoji-chrome.zip .
rm -rf tmp
