'use strict';

class TutuModel {
    constructor() {
        var loadDir = __dirname;
    }

    load() {
        var loadDir = __dirname;
        var loadFileArray = fs.readdirSync(modelPath);

        loadFileArray = _.reject(loadFileArray, function(f) {
            if (path.extname(f) != '.js' || f == 'index.js') {
                return true;
            }

            return false;
        });
    }
}

module.exports = TutuModel;