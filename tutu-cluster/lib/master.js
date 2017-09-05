'use strict';

const os = require('os');
const util = require('util');
const path = require('path');
const cluster = require('cluster');
const EventEmitter = require('events');
// const childprocess = require('child_process');
const cfork = require('cfork');
const ready = require('get-ready');
// const detectPort = require('detect-port');

const parseOptions = require('./utils/options');
const Messenger = require('./utils/messenger');

const agentWorkerFile = path.join(__dirname, 'agent_worker.js');
const appWorkerFile = path.join(__dirname, 'app_worker.js')
const APP_ADDRESS = Symbol('Master#appAddress');
const REALPORT = Symbol('Master#realport');

class Master extends EventEmitter {
    /**
     * @constructor
     * @param {Object} options
     *  - {String} [framework] - specify framework that can be absolute path or npm package
     *  - {String} [baseDir] directory of application, default to `process.cwd()`
     *  - {Object} [plugins] - customized plugins, for unittest
     *  - {Number} [workers] numbers of app workers, default to `os.cpus().length`
     *  - {Number} [port] listening port, default to 7001(http) or 8443(https)
     *  - {Boolean} [https] https or not
     *  - {String} [key] ssl key
     *  - {String} [cert] ssl cert
     */
    constructor(options) {
        super();
        this.options = parseOptions(options);
        this.messenger = new Messenger(this);
        console.log('master');

        ready.mixin(this);

        this.isProduction = isProduction();
        this.isDebug = isDebug();
        this.closed = false;
        this[REALPORT] = this.options.port;
        this.logger = require(path.join(this.options.baseDir, 'tutu-logger')).coreLogger;
        this.isStarted = false;
        // this.forkAppWorkers();
    }
}

module.exports = Master;

function isProduction() {
    return process.env.NODE_ENV === 'production';
}

function isDebug() {
    return process.execArgv.indexOf('--debug') !== -1 || typeof v8debug !== 'undefined';
}