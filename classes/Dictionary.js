const fs = require('fs');

const BaseClass = require('./BaseClass');
const FileHandler = require('./FileHandler');

class Dictionary extends BaseClass {
    constructor() {
        super();
        this.dict = this.initDict();
    }

    initDict() {
        let fileNames = FileHandler.getFiles('json', this.dictdir)
        let dict = [];
        for (let i = 0; i < fileNames.length; i++) {
            const r = fs.readFileSync(fileNames[i], 'utf8', (err) => {
                if (err)
                    throw err;
            });
            dict.push(JSON.parse(r))
        }
        return dict;
    }
}
module.exports = Dictionary;
