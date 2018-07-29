#!/usr/bin/env node

const fs = require('fs');
const path = require('path');


const command = process.argv[2] || 'documentation';
const argumends = process.argv.slice(3);

const options = {};
const commands = [];
for (let i = 0; i < argumends.length; i++) {
    if (argumends[i].indexOf('--') === 0) {
        const flag = argumends[i].slice(2);
        const flagArray = flag.split('=');
        const key = flagArray[0];
        const value = flagArray[1];
        options[key] = value;
    } else {
        commands.push(argumends[i])
    }
}

const csvToJson = (csvPath, destJson) => {
    const separator = options.separator || ',';

    const csv = fs.readFileSync(csvPath, { encoding: 'utf8' });
    const fileLines = csv.split('\n');
    const keys = fileLines[0].split(separator);
    const values = fileLines.slice(1);

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

const jsonToCsv = (jsonPath, destCsv) => {
    const jsonFile = fs.readFileSync(jsonPath, { encoding: 'utf8' });
    const jsonLines = jsonFile.split('\n');
    let json = null;
    
    let eachLineIsAnObject = true;
    for (let i = 0; i < jsonLines.length; i++) {
        if (jsonLines[i][0] !== '{' && jsonLines[i][jsonLines[i].length - 1] !== '}') {
            eachLineIsAnObject = false;
            break;
        }
    }

   if (eachLineIsAnObject) {
        json = JSON.parse('[' + jsonLines.join(',') + ']');
   } else {
       json = require(jsonPath);
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
            if (regex.test(val)) {
                val = '"' + val + '"';
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

const documentaiton = () => {
    console.log(``);
};


const handler = {
    'csv-to-json': csvToJson,
    'json-to-csv': jsonToCsv,
    'documentaiton': documentaiton,
};

const handlerFunction = handler[command];
handlerFunction(...commands);

