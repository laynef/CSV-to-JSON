const fs = require('fs');
const path = require('path');
const description = 'Convert your csv file to json format';

const command = (csvp, djson, options) => {
    const csvPath = path.resolve(csvp);
    const destJson = path.resolve(djson);

    const keyLine = options.key_line ? Number(options.key_line) : 0;
    const valueStartLine = options.value_start_line ? Number(options.value_start_line) : 1;
    const keySeparator = options.all_separators || options.key_separator || ',';
    const valueSeparator = options.all_separators || options.value_separator || ',';

    const csv = fs.readFileSync(csvPath, { encoding: 'utf8' });
    const fileLines = csv.split('\n');
    const keys = fileLines[keyLine].split(keySeparator);
    const values = fileLines.slice(valueStartLine);

    const data = [];
    for (let i = 0; i < values.length; i++) {
        const object = {};
        const arrayOfValues = values[i].split(valueSeparator);

        for (let j = 0; j < arrayOfValues.length; j++) {
            const key = keys[j];
            object[key] = arrayOfValues[j] || null;
        }

        data.push(object);
    }

    fs.writeFileSync(destJson, JSON.stringify(data));
    console.log(`Successfully converted CSV to JSON`)
};

const documentation = () => {
    console.info(`
    Command:
    csvToJson csv-to-json <existing-csv-file-path> <destintion-json-file-path> [options]

    Options
    --key_line='<The line number the keys are stored on (default is 0)>'
    --value_start_line='<The line number the values start on (default is 1)>'

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
