class BaseClass {
    constructor() {
        this.dictdir = __dirname + '.\\..\\dictionaries'
        this.resumedir = __dirname + '.\\..\\cvs';
        this.outputdir = this.resumedir + '.\\..\\cvs\\output';
    }
}
module.exports = BaseClass;
