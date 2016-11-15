// @flow

/**
 * Module dependencies.
 */
import bodyParser from 'body-parser';
import Log4jsMiddleware from './Log4jsMiddleware';
import Routes from './Routes';
import type express from 'express';
import passport from './passport/Passport';

export default function init(app: express) {
  app.set('showStackError', true);

  app.use(passport.initialize());

  app.use((req, res, next) => {
    req.qare = {};
    next();
  });

  // request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(Log4jsMiddleware);

  /**
   * Initialize Routes
   */
  Routes.init(app);
}
