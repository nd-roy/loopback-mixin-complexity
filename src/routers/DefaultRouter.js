// @flow

import { Router } from 'express';
import DefaultController from '../controllers/DefaultController';
// import swaggerUi from 'swagger-ui-express';
import { merge } from 'lodash';
// import config from '../utils/ConfigUtils';

const DefaultRouter: Function = function defaultRouter(): Router {
  const router = Router();

  // perhaps expose some API metadata at the root
  router.get('/', DefaultController.defaultEndpoint);

  // Route that triggers a sample error
  router.get('/error', DefaultController.createError);
  // api.use('/explorer', swaggerUi.serve, swaggerUi.setup(
  //   merge({
  //     host: `${config.http.host}:${config.http.port}`,
  //   }, swaggerDocument)
  // ));

  return router;
};

export default DefaultRouter;
