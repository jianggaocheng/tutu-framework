'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');

/**
 * @namespace Tutu
 */

// exports.Application = require('/lib/application');
exports.Logger = require('./tutu-logger');

exports.Template = require('./lib/template');

// set express middleware
let app = express();
app.use(bodyParser.json());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

exports.public = require('./lib/public')(app);
exports.app = app;

exports.utils = require('./lib/utils');