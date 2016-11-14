// @flow

import express from 'express';
import Middleware from './middlewares/Middleware';
import Init from './middlewares/Init';

const app = express();

Init(app);

export default Middleware(app);
