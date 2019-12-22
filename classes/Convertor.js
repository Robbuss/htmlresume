const fs = require('fs');
const path = require('path');

const pdfparse = require('pdf-parse');
const PDFParser = require('pdf2json');
const word2pdf = require('word2pdf');
const pdftohtml = require('pdftohtmljs');
const mammoth = require('mammoth');

const BaseClass = require('./BaseClass');

class Convertor extends BaseClass {
    async wordToPdf(files) {
        for (let i = 0; i < files.length; i++) {

            if (!files[i].match(/(\.docx|\.doc)/)) {
                console.log('File is not a doc or docx, skipping...')
                continue;
            }

            if (fs.existsSync(files[i].replace(/(docx|doc)/, 'pdf'))) {
                console.log('PDF file exists, skipping..')
                continue;
            }

            const data = await word2pdf(files[i])

            fs.writeFileSync(files[i].replace(/(docx|doc)/, 'pdf'), data, function (err) {
                console.log(err)
            });
            console.log('Converted ' + files[i] + ' to pdf');
        }
    };

    async wordToHtml(files) {
        for (let i = 0; i < files.length; i++) {

            if (!files[i].match(/(\.docx|\.doc)/)) {
                console.log('File is not a doc or docx, skipping...')
                continue;
            }

            if (fs.existsSync(files[i].replace(/(docx|doc)/, 'html'))) {
                console.log('HTML file exists, skipping..')
                continue;
            }
            console.log(files[i]);
            const data = (await mammoth.convertToHtml({ path: files[i] })).value

            fs.writeFileSync(files[i].replace(/(docx|doc)/, 'html'), data, function (err) {
                console.log(err)
            });
            console.log('Converted ' + files[i] + ' to html');
        }
    };

    async pdfToText(files) {
        for (let i = 0; i < files.length; i++) {

            if (!files[i].endsWith('.pdf')) {
                console.log('File is not a PDF, skipping...')
                continue;
            }
            if (fs.existsSync(files[i].replace('pdf', 'txt').replace(path.dirname(files[i]), this.outputdir))) {
                console.log('Text file exists, skipping..')
                continue;
            }

            let renderOptions = {
                //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
                normalizeWhitespace: true,
                //do not attempt to combine same line TextItem's. The default value is `false`.
                disableCombineTextItems: false
            }

            let pdf = await pdfparse(fs.readFileSync(files[i]), renderOptions)
            fs.writeFile(files[i].replace('pdf', 'txt'), pdf.text, function (err) {
                if (err) throw err;
                console.log('Created file.');
            });
            console.log('Converted ' + files[i] + ' to text');
        }
    }

    // async pdfToJson(files) {
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

    // var converter = new pdftohtml('cvs/', "sample.html");
    // converter.convert('default').then(function() {
    //     console.log("Success");
    //   }).catch(function(err) {
    //     console.error("Conversion error: " + err);
    //   });

}
module.exports = new Convertor;