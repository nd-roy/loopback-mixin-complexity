// @flow

import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './utils/ConfigUtils';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import FileStreamRotator from 'file-stream-rotator';
import log4js from 'log4js';
import { EventEmitter } from 'events';
import express from 'express';
import jsonLayout from 'log4js-json-layout';

import DefaultRouter from './routers/DefaultRouter';
import DoctorRouter from './routers/DoctorRouter';
import OAuthRouter from './routers/OAuthRouter';
import PatientRouter from './routers/PatientRouter';
import UserRouter from './routers/UserRouter';
import Passport from './middleware/passport/Passport';
import NotFoundFallBackFunction from './functions/NotFoundFallBackFunction';
import ErrorHandlerFunction from './functions/ErrorHandlerFunction';

const app = express();

/**
 * Allow cors
 */
app.use(cors());

/**
 * Configuration.
 */
const properties = config.getConfig();
/**
 * Application specifics
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(compression());
const emitter = new EventEmitter();
emitter.setMaxListeners(100);

/**
 * Passport JS
 */
app.use(Passport(properties.applicationUrl).initialize());

/**
 * Routers
 */
app.use('/', DefaultRouter());
app.use('/doctor', DoctorRouter());
app.use('/oauth', OAuthRouter());
app.use('/patient', PatientRouter());
app.use('/user', UserRouter());

/**
 * 404
 */
app.use(NotFoundFallBackFunction);


/**
 * Error fallback
 */
app.use(ErrorHandlerFunction);

/**
 * Routing & initialize Models for application
 */

/**
 *   server - http
 */
const server = app.listen(properties.application.port, () => {
  const { address, port } = server.address();
  logger.info(`Environment = ${properties.env}`);
  logger.info(`Api listening at http://${address}:${port}`);
});
