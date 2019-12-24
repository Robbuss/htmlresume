const { PythonShell } = require('python-shell');
const express = require('express');
const app = express();

const FileHandler = require('./classes/FileHandler');
const Convertor = require('./classes/Convertor');
const Extractor = require('./classes/Extractor');
const Tagger = require('./classes/Tagger');

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

  res.render('index', { extracted: extracted, tagged: [] })
})

app.get('/convert', function (req, res) {
  main()
  res.render('index', { extracted: [], tagged: [] })
})

app.get('/tag', function (req, res) {
  const extractfiles = FileHandler.getFiles(['html', 'txt'], __dirname + '\\cvs\\' + req.query.id)
  const tagfiles = FileHandler.getFiles(['html', 'txt'], __dirname + '\\cvs\\' + req.query.id)
  if (extractfiles.length === 0 && tagfiles.length === 0)
    return res.render('index', { extracted: [], tagged: [] })

  const extracted = Extractor.extract(extractfiles)
  const tagged = Tagger.tag(extractfiles)

  if (req.query.json)
    return res.json([extracted, tagged])

  res.render('index', { extracted: extracted, tagged: tagged })
})

app.listen(3001, function () {
  console.log('server running on port 3001');
})