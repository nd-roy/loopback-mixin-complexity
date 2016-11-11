// @flow

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { extend } from 'lodash';
import ConfigUtils from '../utils/ConfigUtils';
import log4js from 'log4js';

const properties = ConfigUtils.getConfig();
const db = {};

const logger = log4js.getLogger('[sequelize]');

logger.info('Initializing Sequelize');

// create your instance of sequelize
const sequelize = new Sequelize(properties.db.name, properties.db.username, properties.db.password);

const modelsDirectory = __dirname + '/models';

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDirectory)
  .filter((file) => ((file.indexOf('.') !== 0) && (file !== 'index.js')))
  // import model files and save model names
  .forEach((file) => {
    logger.debug(`Loading model file ${file}`);
    const model = sequelize.import(path.join(modelsDirectory, file));
    db[model.name] = model;
  });

// invoke associations on each of the models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    return sequelize
      .sync();
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err);
  });

// assign the sequelize variables to the db object and returning the db.
export default extend({
  sequelize,
  Sequelize,
}, db);