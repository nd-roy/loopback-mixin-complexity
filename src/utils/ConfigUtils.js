// @flow

import nconf from 'nconf';

/**
 * @todo Validate the configuration
 */
class ConfigUtils {
  /**
   * Return all the parameters of the application.
   *
   * @returns {{env: string}}
   */
  static getConfig() : any {
    nconf.file('./config/parameters.json').env();

    const env:string = nconf.get('NODE_ENV') || 'local';

    const config:any = nconf.get(env);

    if (config.mongodb === undefined) {
      throw new Error('Missing MongoDb parameters');
    }

    if (config.redis === undefined) {
      throw new Error('Missing Redis parameters');
    }

    const application = config.application;

    config.applicationUrl = `${application.scheme}://${application.domain}:${application['port-https']}`;

    config.env = env;

    return config;
  }
}

export default ConfigUtils;
