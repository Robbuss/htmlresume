const fs = require('fs');
const path = require('path');

// lets first throw some regexes at these things, moving them to python later
class Extractor {
    extract(dirs) {
        for (let i = 0; i < dirs.length; i++) {
            if (!dirs[i].endsWith('.txt'))
                continue

            const pod = []
            fs.readFile(dirs[i], 'utf8', function (err, data) {
                if (err) throw err;
                let phone = data.match(/(\+[0-9]{2}|\+[0-9]{2}\(0\)|\(\+[0-9]{2}\)\(0\)|00[0-9]{2}|0)([0-9]{9}|[0-9\-\s]{10})/g)
                let email = data.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
                pod.push({
                    'person': dirs[i],
                    'email': email,
                    'phone': phone,
                })
            })
        }
    }
}
module.exports = new Extractor;
