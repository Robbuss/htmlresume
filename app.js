const { PythonShell } = require('python-shell');
const express = require('express');
const app = express();

const FileHandler = require('./FileHandler');
const Convertor = require('./Convertor');
const Extractor = require('./Extractor');

// check if files need to be converted
async function main() {
  await Convertor.wordToPdf(FileHandler.getFiles('doc')) // this will include .docx
  await Convertor.wordToHtml(FileHandler.getFiles('doc')) // this will include .docx
  await Convertor.pdfToText(FileHandler.getFiles('pdf'));
  await FileHandler.toOutput('txt');
};

app.set('view engine', 'pug')

app.get('/python', function (req, res) {
  PythonShell.run('./sentiment.py', {}, function (err, data) {
    if (err) res.send(err);
    res.json(JSON.parse(data))
  });
})

app.get('/extract/:ext', function (req, res) {
  const extracted = Extractor.extract(FileHandler.getFiles(req.params.ext))

  if (req.query.json)
    return res.json(extracted)

  res.render('index', { data: extracted })
})

app.get('/convert', function (req, res) {
  main()
  res.render('index', { data: [] })
})

app.get('/tag', function (req, res) {
  const files = FileHandler.getFiles(['html', 'txt'], __dirname + '\\cvs\\' + req.query.id)
  if (files.length === 0)
    return res.render('index', { data: [] })

  const extracted = Extractor.extract(files) // write tagger file here instead of extractor

  if (req.query.json)
    return res.json(extracted)    
    
  res.render('index', { data: extracted })
})

app.listen(3001, function () {
  console.log('server running on port 3001');
})