'use strict';

const express = require('express');

/**
 * @namespace Tutu
 */

// exports.Application = require('/lib/application');
exports.Logger = require('./tutu-logger');

exports.Template = require('./lib/template');

let app = express();

exports.public = require('./lib/public')(app);
exports.app = app;

exports.utils = require('./lib/utils');