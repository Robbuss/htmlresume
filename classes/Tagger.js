const fs = require('fs');
const Dictionary = require('./Dictionary');

class Tagger extends Dictionary {
    placeTag(word, color, label){
        return '<span class=\'tag is-'+ color +'\'>' + word + ': ' +label + '</span>'
    }

    tag(dirs) {
        const data = []
        for (let i = 0; i < dirs.length; i++) {
            let fileContent = fs.readFileSync(dirs[i], 'utf8', function (err) {
                if (err) throw err;
            });
            let untagged = fileContent.split(' ');
            // console.log('Wordcount: ' + untagged.length);
            // untagged = untagged.filter(x => x.length > 2);
            // console.log('Wordcount after filter: ' + untagged.length);

            // elk tagged woord
            for (let j = 0; j < untagged.length; j++) {
                untagged[j] = untagged[j].replace('\n', '').toLowerCase()
                let word = {
                    min_2: untagged[j - 2],
                    min_1: untagged[j - 1],
                    word: untagged[j],
                    plus_1: untagged[j + 1],
                    plus_2: untagged[j + 2]
                }
                // console.log(word);

                // elke file dict
                for (let d of this.dict) {
                    // elk dict array
                    for (let i = 0; i < d.data.length; i++) {
                        // we need the power of regex over here
                        if (untagged[j] == (d.data[i])) {
                            untagged[j] = this.placeTag(untagged[j], d.color, d.label);
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
