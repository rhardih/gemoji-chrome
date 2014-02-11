#!/usr/bin/env bash

mv gemoji/images/emoji/+1.png gemoji/images/emoji/plusone.png
mv gemoji/images/emoji/-1.png gemoji/images/emoji/minusone.png
mv gemoji/images/emoji/100.png gemoji/images/emoji/onehundred.png
mv gemoji/images/emoji/1234.png gemoji/images/emoji/onetwothreefour.png
mv gemoji/images/emoji/8ball.png gemoji/images/emoji/eightball.png

mogrify -resize 30x30 gemoji/images/emoji/*.png
