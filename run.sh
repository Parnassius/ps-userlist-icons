#!/bin/sh

set -eu

mkdir -p ps-data

wget -O ps-data/config.js https://play.pokemonshowdown.com/config/config.js
wget -O ps-data/battledata.js https://play.pokemonshowdown.com/js/battledata.js
wget -O ps-data/pokedex-mini.js https://play.pokemonshowdown.com/data/pokedex-mini.js
wget -O ps-data/pokedex.js https://play.pokemonshowdown.com/data/pokedex.js

wget -O ps-data/pokemonicons-sheet.png https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png

wget -O data.csv "$1"

python -m pip install Pillow
python offsets.py

node run.js
