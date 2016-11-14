// @flow

import config from '../utils/ConfigUtils';
import log4js from 'log4js';
import type express from 'express';

const logger = log4js.getLogger();

export default function (app: express) {
  app.listen(config.http.port, () => {
    logger.info(`Environment = ${config.env}`);
    logger.info(`Api listening on ${config.http.port}`);
  });
}
