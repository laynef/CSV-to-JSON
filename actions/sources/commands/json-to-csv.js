const fs = require('fs');
const path = require('path');
const description = 'Convert your json file to csv format';

const command = (jsn, dcsv, options) => {

    const jsonPath = path.resolve(jsn);
    const destCsv = path.resolve(dcsv);
    const tempJsn = fs.readFileSync(jsonPath, { encoding: 'utf' });
    const json = JSON.parse(tempJsn);

    if (!Array.isArray(json)) {
        console.log('JSON must be an array of objects');
    }

    const keySeparator = options.all_separators || options.key_separator || ',';
    const valueSeparator = options.all_separators || options.value_separator || ',';
    const amountOfSeparatedLines = Number(options.amount_of_separated_lines) || 1;

    const destintationArray = destCsv.split('/');
    const destintationPath = destintationArray.slice(0, destintationArray.length - 1).join('/');
    const fileName = destintationArray[destintationArray.length - 1];

    const keyCache = {};
    // array
    for (let i = 0; i < json.length; i++) {

        const object = json[i];

        // object
        let keys = '';
        let value = '';
        for (let key in object) {
            let val = object[key];
            const regex = new RegExp(value_separator, 'g');
            if (regex.test(val) || typeof val === 'object') {
                val = '"' + JSON.stringify(val).replace(/\"/g, '\\"') + '"';
            }
            keys += key + keySeparator;
            value += val + valueSeparator;
        }

        keys = keys.slice(0, keys.length - 1)
        value = value.slice(0, value.length - 1)

        keyCache[keys] = keyCache[keys] ? keyCache[keys] : '';

        let existingValue = keyCache[keys];
        keyCache[keys] = existingValue + value + '\n';
    }

    let amount = '';
    for (let i = 0; i < amountOfSeparatedLines; i++) {
        amount += '\n';
    }

    let count = 0;
    for (let file in keyCache) {
        const newFilePartial = fileName.split('.');
        const newFilename = count > 0 ? newFilePartial[0] + '-' + count + newFilePartial.slice(1) : fileName;
        fs.writeFileSync(destintationPath + '/' + newFilename, file + amount + keyCache[file]);
    }

    console.log(`Successfully converted JSON to CSV`)
};


const documentation = () => {
    console.info(`
    If the json has different schema it will return multiple files. Keeping the data for that schema
    in each separate file. This is separated by a 'dash' and a number.

    csvToJson json-to-csv <existing-json-file-path> <destintion-csv-file-path> [options]

    Options
    --amount_of_separated_lines='<The amount the separated between keys and values (default is 1)>'

    Separators
    --all_separators='<The character the values get separated be (default is ,)>'
    OR
    --key_separator='<The character the values get separated be (default is ,)>'
    --value_separator='<The character the values get separated be (default is ,)>'
    `);
};

module.exports = {
    command,
    description,
    documentation,
};
