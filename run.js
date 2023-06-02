const fs = require('fs');
process.chdir(__dirname);

require('./pokemon-showdown-client/js/battle-dex.js');

window.BattlePokedex = require('./pokemon-showdown-client/data/pokedex.js').BattlePokedex;
eval(fs.readFileSync('./pokemon-showdown-client/js/battle-dex-data.js', 'utf8'));
window.BattlePokemonIconIndexes = BattlePokemonIconIndexes;

const csvData = fs.readFileSync('./data.csv', 'utf8').trim().split('\n');
const offsets = fs.readFileSync('./offsets.csv', 'utf8').trim().split('\n');
const users = {};
for (const row of csvData) {
    const [user, pokemon] = row.split(',');
    const num = Dex.getPokemonIconNum(pokemon);
    const offset = offsets[num];
    if (!users.hasOwnProperty(num)) {
        users[num] = {offset: offset, names: []};
    }
    users[num].names.push(user);
}
let icons = '';
for (const [num, {offset, names}] of Object.entries(users)) {
    icons += `.i(${num},${offset},"${names.join('","')}");\n`;
}

if (icons !== fs.readFileSync('./icons.css', 'utf8')) {
    fs.writeFileSync('./icons.css', icons);

    const date = new Date();
    const version = `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()}.${date.getUTCHours()}.${date.getUTCMinutes()}.${date.getUTCSeconds()}`;
    const sheetURL = Dex.getPokemonIcon('bulbasaur').match(/url\(([^)]+)\)/)[1];

    let css = fs.readFileSync('./base.css', 'utf8');
    css = css.replace('%version%', version);
    css = css.replace('%sheet_url%', sheetURL);
    css = css.replace(/^ *%icons%/gm, icons.trim());
    fs.writeFileSync('./usericons.user.css', css);
}
