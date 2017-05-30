// @flow

import ModelDefinition from 'loopback-datasource-juggler/lib/model-definition';
import debugModule from 'debug';
import { check, create } from 'string-complexity';
import ValidationError from './ValidationError';

const debug = debugModule('loopback:mixin:complexity');

function validatePassword(options: {}, plain: string) : boolean {
  if (typeof plain === 'string' && check(plain, options)) {
    return true;
  }

  throw new ValidationError('password', 'format', 'Invalid Format.');
}

export default (Model: ModelDefinition, options: {}) => {
  if (Model && Model.sharedClass) {
    const fields = options.fields || [];
    Object.keys(fields).forEach((field: string) => {
      debug(`Add validation on field: ${field}`);
      if (field === 'password') {
        Model.validatePassword = validatePassword.bind(null, fields[field]);
      } else {
        Model.validatesFormatOf(field, {
          with: create(fields[field]),
          message: 'Invalid format',
        });
      }
    });
  }
};

