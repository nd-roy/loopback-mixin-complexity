// @flow

/**
 * Represents an http error.
 *
 * This class is user by the error handler to render exceptions.
 */
class HttpError extends Error {
  statusCode: number;
  context: {};
  message: string;
  status: number;

  setStatusCode: Function = function setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
    this.status = statusCode;
  }
}

export default HttpError;
