#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const command = process.argv[2] || 'documentation';
const argumends = process.argv.slice(3);

const option = {};
const commands = [];
for (let i = 0; i < argumends.length; i++) {
    if (argumends[i].indexOf('--') === 0) {
        const flag = argumends[i].slice(2);
        const flagArray = flag.split('=');
        const key = flagArray[0];
        const value = flagArray[1];
        option[key] = value;
    } else {
        commands.push(argumends[i])
    }
}

const csvToJson = (csvPath, destJson, options) => {
    const separator = options.separator || ',';
    const keyLine = Number(options.key_line) || 0;
    const valueStartLine = Number(options.value_start_line) || 1;

    if (options.help) {
        console.log(`
csvToJson csv-to-json <existing-csv-file-path> <destintion-json-file-path> [options]

Options
--separator='<The character separating the data>'
--key_line='<The line number the keys are stored on (default is 0)>'
--value_start_line='<The line number the values start on (default is 1)>'
        `);
        return;
    }

    const csv = fs.readFileSync(csvPath, { encoding: 'utf8' });
    const fileLines = csv.split('\n');
    const keys = fileLines[keyLine].split(separator);
    const values = fileLines.slice(valueStartLine);

    const data = [];
    for (let i = 0; i < values.length; i++) {
        const object = {};
        const arrayOfValues = values[i].split(separator);

        for (let j = 0; j < arrayOfValues.length; j++) {
            const key = keys[j];
            object[key] = arrayOfValues[j] || null;
        }

        data.push(object);
    }

    fs.writeFileSync(destJson, JSON.stringify(data));
};

const cleanMongoDbDataset = (jsonPath, cleanPath, options) => {

    if (options.help) {
        console.log(`
csvToJson clean-mongodb-dataset <existing-json-file-path> <destintion-json-file-path>
        `);
        return;
    }

    const jsonFile = fs.readFileSync(jsonPath, { encoding: 'utf8' });
    const jsonLines = jsonFile.split('\n');
    const innerData = jsonLines.join(',');
    fs.writeFileSync(cleanPath, `[${innerData.slice(0, innerData.length - 1)}]`);
}

const jsonToCsv = (jsonPath, destCsv, options) => {
    const json = require(jsonPath);

    if (options.help) {
        console.log(`
If the json has different schema it will return multiple files. Keeping the data for that schema
in each separate file. This is separated by a 'dash' and a number.

csvToJson json-to-csv <existing-json-file-path> <destintion-csv-file-path>
        `);
        return;
    }

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

        const object = json[i];

        // object
        let keys = '';
        let value = ''
        for (let key in object) {
            let val = object[key];
            const regex = new RegExp(separator, 'g');
            if (regex.test(val) || typeof val === 'object') {
                val = '"' + JSON.stringify(val).replace(/\"/g, '\\"') + '"';
            }
            keys += key + separator;
            value += val + separator;
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
        fs.writeFileSync(destintationPath + '/' + newFilename, file + '\n' + keyCache[file]);
    }

};

const documentation = () => {
    console.log(`
CSV to JSON

Type in the command and '--help' for any documentation on the options given
JSON-to-CSV will give you multiple files if the schema is different. All data with 
the same schema will be in the same file.

csvToJson documentation
csvToJson csv-to-json <existing-csv-file-path> <destintion-json-file-path> [options]
csvToJson json-to-csv <existing-json-file-path> <destintion-csv-file-path>
csvToJson clean-mongodb-dataset <existing-json-file-path> <destintion-json-file-path>

Short hand Alias
csvToJson docs
csvToJson c2j <existing-csv-file-path> <destintion-json-file-path> [options]
csvToJson j2c <existing-json-file-path> <destintion-csv-file-path>
csvToJson mongo <existing-json-file-path> <destintion-json-file-path>
    `);
};


const handler = {
    'csv-to-json': csvToJson,
    'json-to-csv': jsonToCsv,
    'clean-mongodb-dataset': cleanMongoDbDataset,
    'documentation': documentation,
    'c2j': csvToJson,
    'j2c': jsonToCsv,
    'mongo': cleanMongoDbDataset,
    'docs': documentation,
};

const handlerFunction = handler[command];
const all = commands.concat(option);
handlerFunction(...all);

