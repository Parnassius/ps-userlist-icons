const fs = require("fs");
const path = require("path");
process.chdir(__dirname);

require("./../pokemon-showdown-client/js/battle-dex.js");

window.BattlePokemonSprites = require("./../pokemon-showdown-client/data/pokedex-mini.js").BattlePokemonSprites;
window.BattlePokedex = require("./../pokemon-showdown-client/data/pokedex.js").BattlePokedex;
eval(fs.readFileSync("./../pokemon-showdown-client/js/battle-dex-data.js", "utf-8"));
window.BattlePokemonIconIndexes = BattlePokemonIconIndexes;

let data = require("./data.json");
let icons = "";
for (let user in data) {
    let num = Dex.getPokemonIconNum(data[user]);
    let top = Math.floor(num / 12) * 30;
    let left = (num % 12) * 40;
    icons += `.userlist li[id$='-userlist-user-${user}'] button::after {background-position: -${left}px -${top}px}\n`;
}

if (icons === fs.readFileSync("./icons.css", "utf-8")) {
    return;
}
fs.writeFileSync("./icons.css", icons);

let date = new Date();
let version = `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()}`;

let css = fs.readFileSync("./base.css", "utf-8");
css = css.replace("%version%", version);
css = css.replace("%icons%", icons);
fs.writeFileSync("./usericons.user.css", css);
