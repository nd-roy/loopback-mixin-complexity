// @flow

import { Router } from 'express';
import DefaultController from '../controllers/DefaultController';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../doc/swagger.json';
import { merge } from 'lodash';
import config from '../utils/ConfigUtils';

const DefaultRouter: Function = function defaultRouter(): Router {
  const api = Router();

  // perhaps expose some API metadata at the root
  api.get('/', DefaultController.defaultEndpoint);

  // Route that triggers a sample error
  api.get('/error', DefaultController.createError);

  const properties = config.getConfig();

  api.use('/explorer', swaggerUi.serve, swaggerUi.setup(
    merge({
      host: `${properties.application.host}:${properties.application.port}`,
    }, swaggerDocument)
  ));

  return api;
};

export default DefaultRouter;
