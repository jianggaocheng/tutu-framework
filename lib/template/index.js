const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const layouts = require('handlebars-layouts');
const _ = require('lodash');

class TutuTemplate {
    constructor() {
        handlebars.registerHelper(layouts(handlebars));
        this.templates = [];
        this.load(__dirname);
    }

    load(loadPath) {
        let fileList = fs.readdirSync(loadPath);
        let th = this;
        _.each(fileList, function(filename) {
            let name = filename.substr(0, _.lastIndexOf(filename, '.'));
            if (path.extname(filename) == '.html') {
                th.templates[name] = handlebars.compile(fs.readFileSync(path.join(loadPath, filename), "utf-8"));
                tutu.coreLogger.debug('Load template:', name);
            } else if (path.extname(filename) == '.hbs') {
                handlebars.registerPartial('layout', fs.readFileSync(path.join(loadPath, filename), 'utf8'));
            }
        });
        return th.templates;
    }

    get templates() {
        return this._templates;
    };
    set templates(templates) {
        this._templates = templates;
    };
}

module.exports = TutuTemplate;