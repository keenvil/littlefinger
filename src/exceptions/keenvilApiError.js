class KeenvilApiError extends Error {

  constructor(...args) {
    super(...args)
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, KeenvilApiError);
    } else {
      this.stack = (new Error(...args)).stack;
    }
  }

  apiErrors = []
}

export default KeenvilApiError;
