const mammoth = require('mammoth');
const pdfparse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

(async function main() {
    const resumedir = __dirname + '\\cvs'
    let dirs = fs.readdirSync(resumedir)
    dirs.splice(dirs.indexOf('.gitignore'), 1);

    for (let i = 0; i < dirs.length; i++) {
        const file = resumedir + '\\' + dirs[i];
        // convert the docx files
        if (file.endsWith('.docx') || file.endsWith('.doc')) {
            const html = await mammoth.extractRawText({ path: file });
            fs.writeFile(file + ".txt", html.value, function(err) {
                if (err) throw err;
                console.log('Created file.');
            });
        }
        // convert the pdfs to text
        if (file.endsWith('.pdf')) {
            const pdf = await pdfparse(fs.readFileSync(file))
            fs.writeFile(file + ".txt", pdf.text, function(err) {
                if (err) throw err;
                console.log('Created file.');
            });
        }
    }
})();