import Http from '../transport/http';
import KeenvilApiError from '../exceptions/keenvilApiError';
import { merge, values } from 'lodash';

/**
 * Class to make HTTP Rest calls to Keenvil's API.
 *
 * This is the place to add common behavior to all requests to
 * Keenvil API. Like general error handling.
 *
 * By default will use Http transport to perform requests
 * to Keenvil's API.
 */
export default class Rest {

  constructor(config) {
    const defaultConfig = {
      apiConfig: null,
      token: null,
      communityId: null,
      module: null,
      pushToken: null,
      applicationId: null,
      operatingSystem: null,
      transport: new Http()
    };
    const mergedConfig = merge(defaultConfig, config);

    this.apiConfig = mergedConfig.apiConfig;
    this.communityId = mergedConfig.communityId;
    this.token = mergedConfig.token;
    this.module = mergedConfig.module;
    this.transport = mergedConfig.transport;
    this.pushToken = mergedConfig.pushToken;
    this.applicationId = mergedConfig.applicationId;
    this.operatingSystem = mergedConfig.operatingSystem;
  }

  keenvilApiSuccessfulResponses = {
    SUCCESS: 200,
    CREATED: 201,
    DELETED: 204
  }

  keenvilApiErrors = {
    SESSION_EXPIRED: 401,
    ACCESS_FORBIDDEN: 403,
    RESOURCE_NOT_FOUND: 404,
    CONFLICT: 409,
    ENTITY_NOT_FOUND: 412,
    SESSION_NOT_VALID: 417,
    UNSUPPORTED_MEDIA_TYPE: 415,
    VALIDATION_ERROR: 422
  }

  serverErrors = {
    INTERNAL_ERROR: 500
  }

  isResponseSerializable(statusCode) {
    return values(this.keenvilApiSuccessfulResponses).includes(statusCode)
    || values(this.keenvilApiErrors).includes(statusCode);
  }

  isSessionExpired(status) {
    return status === this.keenvilApiErrors.SESSION_EXPIRED;
  }

  hasPreconditionFailed(status) {
    return status === this.keenvilApiErrors.ENTITY_NOT_FOUND;
  }

  isAccessTokenExpired(status) {
    return status === this.keenvilApiErrors.SESSION_NOT_VALID;
  }

  notFound(status) {
    return status === this.keenvilApiErrors.RESOURCE_NOT_FOUND;
  }

  isResourceAlreadyExists(status) {
    return status === this.keenvilApiErrors.CONFLICT;
  }

  mapStatusToExceptionCode (status) {
    if (this.isSessionExpired(status)) {
      return 'sessionHasBeenExpired';
    }
    if (this.isAccessTokenExpired(status)) {
      return 'tokenExpired';
    }
    if (this.hasPreconditionFailed(status)) {
      return 'preconditionFailed';
    }
    if (this.notFound(status)) {
      return 'notFound';
    }
    if (this.isResourceAlreadyExists(status)) {
      return 'resourceAlreadyExists';
    }
  }

  buildErrorItem(errorItem) {
    if (errorItem.code == null) {
      errorItem.code = this.mapStatusToExceptionCode(errorItem.httpStatus);
    }
    return errorItem;
  }

  buildError(errorPayload) {
    let error = new KeenvilApiError();
    if (Array.isArray(errorPayload)) {
      error.apiErrors = errorPayload.map(
        errorItem => this.buildErrorItem(errorItem)
      );
    } else {
      error.apiErrors = [this.buildErrorItem(errorPayload)];
    }
    return error;
  }

  /**
   * This method will try to serialize the response into JSON while
   * throwing errors based on the response status code.
   *
   * @param {Object} response fetch Response object
   */
  processResponse(response, isJsonResponse = true) {
    if (!response.ok && !this.isResponseSerializable(response.status)) {
      throw this.buildError([
        {
          httpStatus: response.status || response.httpStatus
        }
      ]);
    }
    const unserializedResult = isJsonResponse ? response.json() : response.text();
    return unserializedResult
      .then((unserializedResponse) => {
        if (!response.ok) {
          throw this.buildError(unserializedResponse);
        } else {
          return unserializedResponse;
        }
      });
  }

  getBaseUrl() {
    const baseUrl = this.apiConfig.getBaseUrl();
    if (baseUrl) {
      return baseUrl;
    } else {
      throw new Error(`The api config method must have a getBaseUrl
      method that returns a valid url`);
    }
  }

  /**
   * Returns headers for an HTTP request.
   * @param {Bool} isPost adds headers for POST requests
   */
  getHeaders(isPost = false) {
    let headers = {
      'X-API-Key': this.apiConfig.getApiKey(),
      'Accept': 'application/json'
    };
    if (isPost) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.token) {
      headers['X-Authorization'] = this.token;
    }
    if (this.applicationId) {
      headers['X-Application-Id'] = this.applicationId;
    }
    if (this.pushToken) {
      headers['X-Device-Push-Token'] = this.pushToken;
    }
    if (this.operatingSystem) {
      headers['X-Device-OS'] = this.operatingSystem;
    }
    return headers;
  }

  /**
   * Given a _path_ to a _resource_ returns its full URI
   * @param {String} path
   */
  buildUrl(path) {
    let url = this.getBaseUrl();

    if (this.module) {
      url = `${url}/${this.module}`;
    }

    if (this.communityId) {
      url = `${url}/c/${this.communityId}`;
    }

    return `${url}/${path}`;
  }

  /**
   * Builds the query string to append to a resource URL
   *
   * @param {Object} query
   * @returns a string with the parameters escaped and concatenated
   */
  buildQueryString(query) {
    return Object.keys(query)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
      .join('&');
  }

  /**
   * Saves an entity to the API
   *
   * @param {String} path to the resource
   * @param {Object} entity to be saved
   * @returns a promise that resolves to a Response (see fetch) object
   */
  save(path, entity, isJsonResponse = true) {
    const url = this.buildUrl(path);
    return this.transport
      .post(this.getHeaders(true), url, entity)
      .then(response => {
        return this.processResponse(response, isJsonResponse);
      });
  }

  /**
   * Updates an entity
   *
   * @param {String} path to the resource
   * @param {Object} entity to be updated
   * @returns a promise that resolves to a Response (see fetch) object
   */
  update(path, entity, isJsonResponse = true) {
    const url = this.buildUrl(path);
    return this.transport
      .put(this.getHeaders(true), url, entity)
      .then(response => {
        return this.processResponse(response, isJsonResponse);
      });
  }

  /**
   * Find all entities for a resource in a given path
   *
   * @param {String} path to the resource
   * @returns a promise that resolves to a Response (see fetch) object
   */
  find(path, isJsonResponse = true) {
    const url = this.buildUrl(path);
    return this.transport
      .get(this.getHeaders(false), url)
      .then(response => {
        return this.processResponse(response, isJsonResponse);
      });
  }

  /**
   * Gets data from a resource
   *
   * @param {String} path to the resource
   * @param {Object} query to pass data to the resource
   * @returns a promise that resolves to a Response (see fetch) object
   */
  query(path, query = {}, isJsonResponse = true) {
    const baseUrl = this.buildUrl(path);
    const url = `${baseUrl}?${this.buildQueryString(query)}`;
    return this.transport
      .get(this.getHeaders(true), url)
      .then(response => {
        return this.processResponse(response, isJsonResponse);
      });
  }

  /**
   * Deletes an entity using the API
   *
   * @param {String} path to the resource
   * @returns a promise that resolves to a Response (see fetch) object
   */
  delete(path, isJsonResponse = true) {
    const url = this.buildUrl(path);
    return this.transport
      .delete(this.getHeaders(true), url)
      .then(response => {
        return this.processResponse(response, isJsonResponse);
      });
  }

  /**
   * Uploads a file to the specified path
   *
   * @param {*} path uri for the upload endpoint
   * @param {*} fileData form data to be uploaded
   * @param {*} isJsonResponse sets if this response should be
   *                           procesed as JSON
   */
  upload(path, fileData, isJsonResponse = true) {
    const url = this.buildUrl(path);
    const headers = this.getHeaders();
    return this.transport
      .multipart(headers, url, fileData)
      .then(response => {
        return this.processResponse(response, isJsonResponse);
      });
  }
}
