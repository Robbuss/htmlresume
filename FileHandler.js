const fs = require('fs');
const resumedir = __dirname + '\\cvs';

class FileHandler {
    getFiles = (ext) => {
        let files = this.walk(resumedir)
        let filtered = files.filter(x => x.includes('.' + ext))

        return filtered;
    }

    walk = (dir) => {
        var results = [];
        var list = fs.readdirSync(dir);
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
}
module.exports = new FileHandler;