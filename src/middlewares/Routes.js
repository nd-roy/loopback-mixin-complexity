// @flow

import DefaultRouter from '../routers/DefaultRouter';
import CustomerRouter from '../routers/CustomerRouter';
import NotFoundHandlerMiddleware from './NotFoundHandlerMiddleware';
import ErrorHandlerMiddleware from './ErrorHandlerMiddleware';
import type express from 'express';

export default class Routes {
  static init(app: express) {
    // Finish with setting up the userId param
    // app.param('userId', users.user);

    // Home route
    app.use(DefaultRouter());
    app.use('/customers', CustomerRouter());
    app.use(NotFoundHandlerMiddleware);
    app.use(ErrorHandlerMiddleware);
  }
}
