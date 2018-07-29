# CSV to JSON Convertor

## Installation
```
git clone https://github.com/laynef/CSV-to-JSON.git
npm i -g
csvToJson
```

## Commands

### CSV-To-JSON
```
csvToJson csv-to-json <existing-csv-file-path> <destintion-json-file-path>
```

### JSON-To-CSV
```
csvToJson json-to-csv <existing-csv-file-path> <destintion-json-file-path>
```

### Clean MongoDB DataSet

If your dataset is a file with a object in each line however is not an array. 
This command will convert that file into an array of objects.

```
csvToJson clean-mongodb-dataset <existing-json-file-path> <destintion-json-file-path>
```