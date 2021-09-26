const fs = require("fs");
const path = require("path");
process.chdir(__dirname);

require("./../pokemon-showdown-client/js/battle-dex.js");

window.BattlePokemonSprites = require("./../pokemon-showdown-client/data/pokedex-mini.js").BattlePokemonSprites;
window.BattlePokedex = require("./../pokemon-showdown-client/data/pokedex.js").BattlePokedex;
eval(fs.readFileSync("./../pokemon-showdown-client/js/battle-dex-data.js", "utf-8"));
window.BattlePokemonIconIndexes = BattlePokemonIconIndexes;

let data = fs.readFileSync("./data.csv", "utf-8").trim().split("\n");
let offsets = fs.readFileSync("./offsets.csv", "utf-8").trim().split("\n");
let icons = "";
for (let row of data) {
    let parts = row.split(",");
    let user = parts[0];
    let pokemon = parts[1];
    let num = Dex.getPokemonIconNum(pokemon);
    let top = Math.floor(num / 12) * 30 + parseInt(offsets[num]);
    let left = (num % 12) * 40;
    icons += `.bg("${user}", -${left}px -${top}px);\n`;
}

if (icons === fs.readFileSync("./icons.css", "utf-8")) {
    return;
}
fs.writeFileSync("./icons.css", icons);

let date = new Date();
let version = `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()}.${date.getUTCHours()}.${date.getUTCMinutes()}.${date.getUTCSeconds()}`;

let css = fs.readFileSync("./base.css", "utf-8");
css = css.replace("%version%", version);
css = css.replace(/^ *%icons%/gm, icons.trim());
fs.writeFileSync("./usericons.user.css", css);
