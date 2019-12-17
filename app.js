const { PythonShell } = require('python-shell');
const express = require('express');
const app = express();
const FileHandler = require('./FileHandler');
const ConvertToText = require('./ConvertToText');
const Extractor = require('./Extractor');

// check if files need to be converted
async function main() {
    await ConvertToText.wordToPdf(FileHandler.getFiles('doc')) // this will include .docx
    await ConvertToText.pdfToText(FileHandler.getFiles('pdf'));
    await ConvertToText.toOutput();

    // regex
    Extractor.extract(FileHandler.getFiles('txt'))
};
main();

// start server to view parsed data from python in browser 
app.listen(3001, function () {
    console.log('server running on port 3000');
})
app.get('/', callpython)

function callpython(req, res) {
    PythonShell.run('./sentiment.py', {}, function (err, data) {
        if (err) res.send(err);
        res.send(data)
      });
}
