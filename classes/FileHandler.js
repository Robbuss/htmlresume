const fs = require('fs');
const path = require('path');
const BaseClass = require('./BaseClass')

class FileHandler extends BaseClass{
    getFiles = (ext, dir = this.resumedir) => {
        if (!Array.isArray(ext))
            ext = [ext]

        let files = this.walk(dir)
        if (files.length === 0)
            return files;

        let filtered = [];
        for (let i = 0; i < ext.length; i++) {
            let f = files.filter(x => x.includes('.' + ext[i]))
            filtered = filtered.concat(f);
        }

        return filtered;
    }

    walk = (dir) => {
        var results = [];
        try {
            var list = fs.readdirSync(dir);
        } catch (e) {
            return [];
        }

        list.forEach((file) => {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results = results.concat(this.walk(file));
            } else {
                /* Is a file */
                results.push(file);
            }
        });
        return results;
    }

    async toOutput(ext = 'txt') {
        let files = this.getFiles(ext)
        let count = 0

        for (let i = 0; i < files.length; i++) {
            let newPath = files[i].replace(path.dirname(files[i]), this.outputdir)

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
}
module.exports = new FileHandler;