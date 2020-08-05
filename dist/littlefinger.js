import { merge, values } from 'lodash';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

/**
 * Thin layer on top of the global fetch object to make
 * HTTP requests
 */
var Http =
/*#__PURE__*/
function () {
  function Http() {
    _classCallCheck(this, Http);
  }

  _createClass(Http, [{
    key: "post",
    value: function post(headers, url, body) {
      return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });
    }
  }, {
    key: "get",
    value: function get(headers, url) {
      return fetch(url, {
        method: 'GET',
        headers: headers
      });
    }
  }, {
    key: "put",
    value: function put(headers, url, body) {
      return fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
      });
    }
  }, {
    key: "delete",
    value: function _delete(headers, url) {
      return fetch(url, {
        method: 'DELETE',
        headers: headers
      });
    }
  }, {
    key: "multipart",
    value: function multipart(headers, url, file) {
      var formData = new FormData();
      formData.append('file', file);
      return fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData
      });
    }
  }]);

  return Http;
}();

var KeenvilApiError =
/*#__PURE__*/
function (_Error) {
  _inherits(KeenvilApiError, _Error);

  function KeenvilApiError() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, KeenvilApiError);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(KeenvilApiError)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "apiErrors", []);

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(_assertThisInitialized(_assertThisInitialized(_this)), KeenvilApiError);
    } else {
      _this.stack = _construct(Error, args).stack;
    }

    return _this;
  }

  return KeenvilApiError;
}(_wrapNativeSuper(Error));

/**
 * Class to make HTTP Rest calls to Keenvil's API.
 *
 * This is the place to add common behavior to all requests to
 * Keenvil API. Like general error handling.
 *
 * By default will use Http transport to perform requests
 * to Keenvil's API.
 */

var Rest =
/*#__PURE__*/
function () {
  function Rest(config) {
    _classCallCheck(this, Rest);

    _defineProperty(this, "keenvilApiSuccessfulResponses", {
      SUCCESS: 200,
      CREATED: 201,
      DELETED: 204
    });

    _defineProperty(this, "keenvilApiErrors", {
      SESSION_EXPIRED: 401,
      ACCESS_FORBIDDEN: 403,
      RESOURCE_NOT_FOUND: 404,
      CONFLICT: 409,
      ENTITY_NOT_FOUND: 412,
      SESSION_NOT_VALID: 417,
      UNSUPPORTED_MEDIA_TYPE: 415,
      VALIDATION_ERROR: 422
    });

    _defineProperty(this, "serverErrors", {
      INTERNAL_ERROR: 500
    });

    var defaultConfig = {
      apiConfig: null,
      token: null,
      communityId: null,
      module: null,
      pushToken: null,
      applicationId: null,
      operatingSystem: null,
      transport: new Http()
    };
    var mergedConfig = merge(defaultConfig, config);
    this.apiConfig = mergedConfig.apiConfig;
    this.communityId = mergedConfig.communityId;
    this.token = mergedConfig.token;
    this.module = mergedConfig.module;
    this.transport = mergedConfig.transport;
    this.pushToken = mergedConfig.pushToken;
    this.applicationId = mergedConfig.applicationId;
    this.operatingSystem = mergedConfig.operatingSystem;
  }

  _createClass(Rest, [{
    key: "isResponseSerializable",
    value: function isResponseSerializable(statusCode) {
      return values(this.keenvilApiSuccessfulResponses).includes(statusCode) || values(this.keenvilApiErrors).includes(statusCode);
    }
  }, {
    key: "isSessionExpired",
    value: function isSessionExpired(status) {
      return status === this.keenvilApiErrors.SESSION_EXPIRED;
    }
  }, {
    key: "hasPreconditionFailed",
    value: function hasPreconditionFailed(status) {
      return status === this.keenvilApiErrors.ENTITY_NOT_FOUND;
    }
  }, {
    key: "isAccessTokenExpired",
    value: function isAccessTokenExpired(status) {
      return status === this.keenvilApiErrors.SESSION_NOT_VALID;
    }
  }, {
    key: "notFound",
    value: function notFound(status) {
      return status === this.keenvilApiErrors.RESOURCE_NOT_FOUND;
    }
  }, {
    key: "isResourceAlreadyExists",
    value: function isResourceAlreadyExists(status) {
      return status === this.keenvilApiErrors.CONFLICT;
    }
  }, {
    key: "mapStatusToExceptionCode",
    value: function mapStatusToExceptionCode(status) {
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
  }, {
    key: "buildErrorItem",
    value: function buildErrorItem(errorItem) {
      if (errorItem.code == null) {
        errorItem.code = this.mapStatusToExceptionCode(errorItem.httpStatus);
      }

      return errorItem;
    }
  }, {
    key: "buildError",
    value: function buildError(errorPayload) {
      var _this = this;

      var error = new KeenvilApiError();

      if (Array.isArray(errorPayload)) {
        error.apiErrors = errorPayload.map(function (errorItem) {
          return _this.buildErrorItem(errorItem);
        });
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

  }, {
    key: "processResponse",
    value: function processResponse(response) {
      var _this2 = this;

      var isJsonResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!response.ok && !this.isResponseSerializable(response.status)) {
        throw this.buildError([{
          httpStatus: response.status || response.httpStatus
        }]);
      }

      var unserializedResult = isJsonResponse ? response.json() : response.text();
      return unserializedResult.then(function (unserializedResponse) {
        if (!response.ok) {
          throw _this2.buildError(unserializedResponse);
        } else {
          return unserializedResponse;
        }
      });
    }
  }, {
    key: "getBaseUrl",
    value: function getBaseUrl() {
      var baseUrl = this.apiConfig.getBaseUrl();

      if (baseUrl) {
        return baseUrl;
      } else {
        throw new Error("The api config method must have a getBaseUrl\n      method that returns a valid url");
      }
    }
    /**
     * Returns headers for an HTTP request.
     * @param {Bool} isPost adds headers for POST requests
     */

  }, {
    key: "getHeaders",
    value: function getHeaders() {
      var isPost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var headers = {
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

  }, {
    key: "buildUrl",
    value: function buildUrl(path) {
      var url = this.getBaseUrl();

      if (this.module) {
        url = "".concat(url, "/").concat(this.module);
      }

      if (this.communityId) {
        url = "".concat(url, "/c/").concat(this.communityId);
      }

      return "".concat(url, "/").concat(path);
    }
    /**
     * Builds the query string to append to a resource URL
     *
     * @param {Object} query
     * @returns a string with the parameters escaped and concatenated
     */

  }, {
    key: "buildQueryString",
    value: function buildQueryString(query) {
      return Object.keys(query).map(function (k) {
        return "".concat(encodeURIComponent(k), "=").concat(encodeURIComponent(query[k]));
      }).join('&');
    }
    /**
     * Saves an entity to the API
     *
     * @param {String} path to the resource
     * @param {Object} entity to be saved
     * @returns a promise that resolves to a Response (see fetch) object
     */

  }, {
    key: "save",
    value: function save(path, entity) {
      var _this3 = this;

      var isJsonResponse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var url = this.buildUrl(path);
      return this.transport.post(this.getHeaders(true), url, entity).then(function (response) {
        return _this3.processResponse(response, isJsonResponse);
      });
    }
    /**
     * Updates an entity
     *
     * @param {String} path to the resource
     * @param {Object} entity to be updated
     * @returns a promise that resolves to a Response (see fetch) object
     */

  }, {
    key: "update",
    value: function update(path, entity) {
      var _this4 = this;

      var isJsonResponse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var url = this.buildUrl(path);
      return this.transport.put(this.getHeaders(true), url, entity).then(function (response) {
        return _this4.processResponse(response, isJsonResponse);
      });
    }
    /**
     * Find all entities for a resource in a given path
     *
     * @param {String} path to the resource
     * @returns a promise that resolves to a Response (see fetch) object
     */

  }, {
    key: "find",
    value: function find(path) {
      var _this5 = this;

      var isJsonResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var url = this.buildUrl(path);
      return this.transport.get(this.getHeaders(false), url).then(function (response) {
        return _this5.processResponse(response, isJsonResponse);
      });
    }
    /**
     * Gets data from a resource
     *
     * @param {String} path to the resource
     * @param {Object} query to pass data to the resource
     * @returns a promise that resolves to a Response (see fetch) object
     */

  }, {
    key: "query",
    value: function query(path) {
      var _this6 = this;

      var _query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var isJsonResponse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var baseUrl = this.buildUrl(path);
      var url = "".concat(baseUrl, "?").concat(this.buildQueryString(_query));
      return this.transport.get(this.getHeaders(true), url).then(function (response) {
        return _this6.processResponse(response, isJsonResponse);
      });
    }
    /**
     * Deletes an entity using the API
     *
     * @param {String} path to the resource
     * @returns a promise that resolves to a Response (see fetch) object
     */

  }, {
    key: "delete",
    value: function _delete(path) {
      var _this7 = this;

      var isJsonResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var url = this.buildUrl(path);
      return this.transport.delete(this.getHeaders(true), url).then(function (response) {
        return _this7.processResponse(response, isJsonResponse);
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

  }, {
    key: "upload",
    value: function upload(path, fileData) {
      var _this8 = this;

      var isJsonResponse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var url = this.buildUrl(path);
      var headers = this.getHeaders();
      return this.transport.multipart(headers, url, fileData).then(function (response) {
        return _this8.processResponse(response, isJsonResponse);
      });
    }
  }]);

  return Rest;
}();

var ApiModule = function ApiModule(name, apiConfig) {
  _classCallCheck(this, ApiModule);

  _defineProperty(this, "adapter", null);

  _defineProperty(this, "name", '');

  this.adapter = new Rest({
    module: name,
    apiConfig: apiConfig
  });
  this.name = name;
};

var ModuleRegistry =
/*#__PURE__*/
function () {
  function ModuleRegistry() {
    _classCallCheck(this, ModuleRegistry);

    _defineProperty(this, "modules", null);

    this.modules = new Map();
  }

  _createClass(ModuleRegistry, [{
    key: "addModule",
    value: function addModule(moduleName, moduleDefinition) {
      if (!this.modules.has(moduleName)) {
        this.modules.set(moduleName, moduleDefinition);
      } else {
        throw new Error("Littlefinger: there is already a module with name ".concat(moduleName));
      }
    }
  }, {
    key: "getModule",
    value: function getModule(moduleName) {
      return this.modules.get(moduleName);
    }
  }]);

  return ModuleRegistry;
}();

/**
 * Library façade
 */

export { Rest, KeenvilApiError, ApiModule, ModuleRegistry };
