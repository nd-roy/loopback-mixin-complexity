// @flow

import nconf from 'nconf';

const env: string = process.env.NODE_ENV || 'local';

nconf
  .file('app', './config/parameters.json')
  .file(`./config/parameters.${env}.json`)
  .env();

const config = nconf.get();
config.env = env;

export default config;
