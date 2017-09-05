const log4js = require('log4js');
const path = require('path');

log4js.configure({
    appenders: {
        console: { type: 'console' },
        app: { type: 'dateFile', filename: 'log/app.log' },
        core: { type: 'dateFile', filename: 'log/tutu.log' },
        error: { type: 'dateFile', filename: 'log/error.log' },
        commonError: {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: 'error'
        },
        appLog: {
            type: 'logLevelFilter',
            level: 'INFO',
            appender: 'app'
        },
        coreLog: {
            type: 'logLevelFilter',
            level: 'INFO',
            appender: 'core'
        },
    },
    categories: {
        default: { appenders: ['console'], level: 'DEBUG' },
        app: { appenders: ['appLog', 'commonError', 'console'], level: 'DEBUG' },
        core: { appenders: ['coreLog', 'commonError', 'console'], level: 'DEBUG' },
    }
});

exports.logger = log4js.getLogger('app');
exports.coreLogger = log4js.getLogger('core');