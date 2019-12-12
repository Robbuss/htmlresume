const fs = require('fs');
const path = require('path');
const { PythonShell } = require('python-shell');
const express = require('express');
const app = express();


app.listen(3001, function () {
    console.log('server running on port 3000');
})

app.get('/', callpython)

function callpython(req, res) {
    PythonShell.run('./sentiment.py', {}, function (err, data) {
        if (err) res.send(err);
        res.send(data.toString())
      });
}

const pdfparse = require('pdf-parse');
// const PDFParser = require("pdf2json");
const word2pdf = require("word2pdf");

const resumedir = __dirname + '\\cvs';
const outputdir = resumedir + '\\output';

(async function main() {
    await wordToPdf(getFiles('doc'))
    await pdfToText(getFiles('pdf'));
    await toOutput();
})();

function getFiles(ext) {
    let files = walk(resumedir)
    let filtered = files.filter(x => x.includes('.' + ext))

    return filtered;
}

function walk(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    console.log(results.length + ' files.')
    return results;
}

async function wordToPdf(files) {
    for (let i = 0; i < files.length; i++) {

        if (!files[i].match(/(\.docx|\.doc)/)) {
            console.log('File is not a doc or docx, skipping...')
            continue;
        }

        if (fs.existsSync(files[i].replace(/(docx|doc)/, 'pdf'))) {
            console.log('PDF file exists, skipping..')
            continue;
        }

        // convert doc to pdf
        const data = await word2pdf(files[i])

        fs.writeFileSync(files[i].replace(/(docx|doc)/, 'pdf'), data, function (err) {
            console.log(err)
        });
        console.log('Converted ' + files[i] + ' to pdf');
    }
};

async function pdfToText(files) {
    for (let i = 0; i < files.length; i++) {

        if (!files[i].endsWith('.pdf')) {
            console.log('File is not a PDF, skipping...')
            continue;
        }
        if (fs.existsSync(files[i].replace('pdf', 'txt').replace(path.dirname(files[i]), outputdir))) {
            console.log('Text file exists, skipping..')
            continue;
        }
        // console.log(fs.readFileSync(files[i]))
        let pdf = await pdfparse(fs.readFileSync(files[i]))

        fs.writeFile(files[i].replace('pdf', 'txt'), pdf.text, function (err) {
            if (err) throw err;
            console.log('Created file.');
        });
        console.log('Converted ' + files[i] + ' to text');
    }
}

async function toOutput() {
    let files = getFiles('txt')
    let count = 0

    for (let i = 0; i < files.length; i++) {
        let newPath = files[i].replace(path.dirname(files[i]), outputdir)

        if (fs.existsSync(newPath)) {
            console.log('Text file exists in output, skipping..')
            continue;
        }
        // move the file by renaming the path
        fs.rename(files[i], newPath, (err) => {
            if (err) throw err;
        });
        count++;
    }
    console.log('Moved ' + count + ' files')
}

// async function pdfToJson(files) {
//     let pdfParser = new PDFParser();
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file.endsWith('.pdf')) {
//             pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
//             pdfParser.on("pdfParser_dataReady", pdfData => {
//                 // console.log(JSON.stringify(pdfData));
//                 fs.writeFile(file + ".json", JSON.stringify(pdfData), function (err) {
//                     console.log('a')
//                 });
//             });

//             pdfParser.loadPDF(file);
//             console.log('Parsed ' + file);
//         }
//     }
// };