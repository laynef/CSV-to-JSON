const description = '<ENTER YOUR DESCRIPTION>';

const command = (argument1, argumentN, options) => {
    const jsonFile = fs.readFileSync(jsonPath, { encoding: 'utf8' });
    const jsonLines = jsonFile.split('\n');
    const innerData = jsonLines.join(',');
    fs.writeFileSync(cleanPath, `[${innerData.slice(0, innerData.length - 1)}]`);
    console.log(`Successfully converted your MongoDB set into an array`);
};

const documentation = () => {
    console.info(`
    Command:
    csvToJson clean-mongodb-dataset <existing-json-file-path> <destintion-json-file-path>
    `);
};

module.exports = {
    command,
    description,
    documentation,
};
