const fs = require('fs');
const path = require('path');

const index = fs.readdirSync(path.join(__dirname, 'commands')).map(e => e.endsWith('.js') ? e.slice(0, e.length - 3) : e).reduce((accumulation, file) => {
    const shortcut = file.split('-').map(e => e[0]).join('').toLowerCase();
    accumulation[file] = require(path.join(__dirname, 'commands', file));
    accumulation[shortcut] = require(path.join(__dirname, 'commands', file));
    return accumulation;
}, {});

module.exports = index;
