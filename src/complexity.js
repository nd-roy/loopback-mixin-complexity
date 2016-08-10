// @flow

import ModelDefinition from 'loopback-datasource-juggler/lib/model-definition';
import debugModule from 'debug';
import { check, create } from 'string-complexity';

const debug = debugModule('loopback:mixin:complexity');

function formatError(field: string) : string {
  return `Field ${field}: Invalid format.`;
}

function validatePassword(options: {}, plain: string) : Boolean {
  if (typeof plain === 'string' && check(plain, options)) {
    return true;
  }

  const error = new Error(formatError('password'));
  error.statusCode = 422;

  throw error;
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
          message: formatError(field),
        });
      }
    });
  }
};

