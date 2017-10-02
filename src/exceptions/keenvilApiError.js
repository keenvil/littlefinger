class KeenvilApiError extends Error {
  
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, KeenvilApiError)
  }

  apiErrors = []
}

export default KeenvilApiError;
