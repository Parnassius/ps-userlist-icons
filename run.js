const fs = require('fs');
const vm = require('vm');
process.chdir(__dirname);

const context = {};
context.window = context;
vm.createContext(context);
for (const script of ['config', 'battledata', 'pokedex-mini', 'pokedex']) {
    vm.runInContext(fs.readFileSync(`./ps-data/${script}.js`, 'utf8'), context);
}

const csvData = fs.readFileSync('./data.csv', 'utf8').trim().split('\n');
const offsets = fs.readFileSync('./offsets.csv', 'utf8').trim().split('\n');
const users = {};
for (const row of csvData) {
    const [user, pokemon] = row.split(',');
    const num = context.Dex.getPokemonIconNum(pokemon);
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

const sheetURL = context.Dex.getPokemonIcon('').match(/url\(([^)]+)\)/)[1];

if (icons !== fs.readFileSync('./icons.css', 'utf8') || !fs.readFileSync('./usericons.user.css', 'utf8').includes(sheetURL)) {
    fs.writeFileSync('./icons.css', icons);

    const date = new Date();
    const version = `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()}.${date.getUTCHours()}.${date.getUTCMinutes()}.${date.getUTCSeconds()}`;

    let css = fs.readFileSync('./base.css', 'utf8');
    css = css.replace('%version%', version);
    css = css.replace('%sheet_url%', sheetURL);
    css = css.replace(/^ *%icons%/gm, icons.trim());
    fs.writeFileSync('./usericons.user.css', css);
}
