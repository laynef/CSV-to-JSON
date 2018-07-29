#!/usr/bin/env node

const fs = require('fs');
const path = require('path');


const command = process.argv[2] || 'documentation';
const argumends = process.argv.slice(3);

const csvToJson = (csvPath, destJson, options) => {
    const separator = options.separator || ',';

    const csv = fs.readFileSync(csvPath, { encoding: 'utf8' });
    const fileLines = csv.split('\n');
    const keys = fileLines[0].split(separator);
    const values = fileLines.slice(1);

    const data = [];
    for (let i = 0; i < values.length; i++) {
        const object = {};
        const arrayOfValues = values[i].split(separator);
        object[keys[i]] = arrayOfValues[i] || null;
        data.push(object);
    }

    fs.writeFileSync(destJson, JSON.stringify(data));
};

const jsonToCsv = (jsonPath, destCsv, options) => {
    const json = require(jsonPath);
    if (!Array.isArray(json)) {
        console.log('JSON must be an array of objects');
    }

    const separator = options.separator || ',';

    const destintationArray = destCsv.split('/');
    const destintationPath = destintationArray.slice(0, destintationArray.length - 1).join('/');
    const fileName = destintationArray[destintationArray.length - 1];

    const keyCache = {};
    // array
    for (let i = 0; i < json.length; i++) {

        // object
        let keys = '';
        let value = ''
        for (let key in json[i]) {
            keys += key + separator
            value += json[i][key] + separator
        }

        keys = keys.slice(0, keys.length - 1)
        value = value.slice(0, value.length - 1)

        keyCache[keys] = keyCache[keys] ? keyCache[keys] : '';

        let existingValue = keyCache[keys];
        keyCache[keys] = existingValue + value + '\n';
    }

    let count = 0;
    for (let file in keyCache) {
        const newFilePartial = fileName.split('.');
        const newFilename = count > 0 ? newFilePartial[0] + '-' + count + newFilePartial.slice(1) : fileName;
        fs.writeFileSync(destintationPath + '/' + newFilename, JSON.stringify(file + '\n' + keyCache[file]));
    }

};

const documentaiton = () => {
    console.log(``);
};


const handler = {
    'csv-to-json': csvToJson,
    'json-to-csv': jsonToCsv,
    'documentaiton': documentaiton,
};

const handlerFunction = handler[command];
handlerFunction(...argumends);

