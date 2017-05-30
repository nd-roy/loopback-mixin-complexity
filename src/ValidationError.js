// @flow

/**
 * Represents an ValidationError error.
 *
 * This class is used by the error handler to render exceptions.
 */
class ValidationError extends Error {
  statusCode: number = 422;
  status: number = 422;
  details: any;

  constructor(field: string, code: string, message: string) {
    super(message);
    this.details = {
      codes: {},
    };
    this.details.codes[field] = [code];
  }
}

export default ValidationError;
