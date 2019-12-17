const fs = require('fs');
const path = require('path');
const pdfparse = require('pdf-parse');
// const PDFParser = require("pdf2json");
const word2pdf = require("word2pdf");
const FileHandler = require('./FileHandler');
const resumedir = __dirname + '\\cvs';
const outputdir = resumedir + '\\output';

class ConvertToText {
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

    async pdfToText(files) {
        for (let i = 0; i < files.length; i++) {

            if (!files[i].endsWith('.pdf')) {
                console.log('File is not a PDF, skipping...')
                continue;
            }
            if (fs.existsSync(files[i].replace('pdf', 'txt').replace(path.dirname(files[i]), outputdir))) {
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
            console.log(pdf.metadata)
            fs.writeFile(files[i].replace('pdf', 'txt'), pdf.text, function (err) {
                if (err) throw err;
                console.log('Created file.');
            });
            console.log('Converted ' + files[i] + ' to text');
        }
    }

    async toOutput() {
        let files = FileHandler.getFiles('txt')
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
}
module.exports = new ConvertToText;