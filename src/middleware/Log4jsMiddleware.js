// @flow

import log4js from 'log4js';
import fs from 'fs';
import jsonLayout from 'log4js-json-layout';

const logDirectory = `${__dirname}/../logs`;

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

log4js.layouts.addLayout('json', jsonLayout);

log4js.configure({
  appenders: [
    { type: 'console', format: ':method :url - :status - :response-time ms' },
    { type: 'file', filename: `${logDirectory}/api.log`, layout: { type: 'json' } },
  ],
});

const logger = log4js.getLogger('express');

export default log4js.connectLogger(logger, {
  level: log4js.levels.DEBUG,
  format: ':method :url - :status - :response-time ms',
});