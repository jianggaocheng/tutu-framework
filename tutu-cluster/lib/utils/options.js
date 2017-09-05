'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

module.exports = function(options) {
    const defaults = {
        framework: '',
        baseDir: process.cwd(),
        port: options.https ? 8443 : 7001,
        workers: null,
        plugins: null,
        https: false,
        key: '',
        cert: '',
    };
    options = extend(defaults, options);
    if (!options.workers) {
        options.workers = os.cpus().length;
    }

    const pkgPath = path.join(options.baseDir, 'package.json');
    assert(fs.existsSync(pkgPath), `${pkgPath} should exist`);

    if (options.https) {
        assert(options.key && fs.existsSync(options.key), 'options.key should exists');
        assert(options.cert && fs.existsSync(options.cert), 'options.cert should exists');
    }

    options.port = parseInt(options.port, 10);
    options.workers = parseInt(options.workers, 10);

    return options;
};

function extend(target, src) {
    const keys = Object.keys(src);
    for (const key of keys) {
        if (src[key] != null) {
            target[key] = src[key];
        }
    }
    return target;
}

/**
 * Try to get framework dir path
 * If can't find any framework, try to find egg dir path
 *
 * @param {String} cwd - current work path
 * @param {Array} [eggNames] - egg names, default is ['egg']
 * @return {String} framework or egg dir path
 * @deprecated
 */
function getFrameworkOrEggPath(cwd, eggNames) {
    eggNames = eggNames || ['egg'];
    const moduleDir = path.join(cwd, 'node_modules');
    if (!fs.existsSync(moduleDir)) {
        return '';
    }

    // try to get framework

    // 1. try to read egg.framework property on package.json
    const pkgFile = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgFile)) {
        const pkg = require(pkgFile);
        if (pkg.egg && pkg.egg.framework) {
            return path.join(moduleDir, pkg.egg.framework);
        }
    }

    // 2. try the module dependencies includes eggNames
    const names = fs.readdirSync(moduleDir);
    for (const name of names) {
        const pkgfile = path.join(moduleDir, name, 'package.json');
        if (!fs.existsSync(pkgfile)) {
            continue;
        }
        const pkg = require(pkgfile);
        if (pkg.dependencies) {
            for (const eggName of eggNames) {
                if (pkg.dependencies[eggName]) {
                    return path.join(moduleDir, name);
                }
            }
        }
    }

    // try to get egg
    for (const eggName of eggNames) {
        const pkgfile = path.join(moduleDir, eggName, 'package.json');
        if (fs.existsSync(pkgfile)) {
            return path.join(moduleDir, eggName);
        }
    }

    return '';
}