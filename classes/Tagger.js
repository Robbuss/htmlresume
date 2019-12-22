const fs = require('fs');
const Dictionary = require('./Dictionary');

class Tagger extends Dictionary{
    tag(dirs) {
        const data = []
        for (let i = 0; i < dirs.length; i++) {
            let fileContent = fs.readFileSync(dirs[i], 'utf8', function (err) {
                if (err) throw err;
            });
            let untagged = fileContent.split(' ');
            untagged = untagged.filter(x => x.length > 2);
            // elk tagged woord
            for(let j = 0; j < untagged.length; j++){
                // elke dict
                for(let d of this.dict){
                    // elk dict array
                    for (let i = 0; i < d.data.length; i++) {
                        // we need the power of regex over here
                        if (untagged[j].toLowerCase() == (d.data[i]).toLowerCase()) {
                            console.log(untagged[j]);
                            untagged[j] = '<span class=\'tag is-primary\'>' + untagged[j] + ': '+ d.label +'</span>'
                        }
                    }
                }
            }
            data.push(untagged.join(' '));
        }
        return data;
    }
}
module.exports = new Tagger;
