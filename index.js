const fs = require('fs');
const path = require('path');


const command = process.argv[2] || 'documentation';

const csvToJson = (csvPath, destJson) => {
    const csv = fs.readFileSync(csvPath, { encoding: 'utf8' });
    const fileLines = csv.split('\n');
    const keys = fileLines[0].split(',');
    const values = fileLines.slice(1);

    const data = [];
    for (let i = 0; i < values.length; i++) {
        const object = {};
        const arrayOfValues = values[i].split(',');
        object[keys[i]] = arrayOfValues[i] || null;
        data.push(object);
    }

    fs.writeFileSync(destJson, JSON.stringify(data));
};

const jsonToCsv = (jsonPath, destCsv) => {
    const json = require(jsonPath);
    if (!Array.isArray(json)) {
        console.log('JSON must be an array of objects');
    }

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
            keys += key + ','
            value += json[i][key] + ','
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

