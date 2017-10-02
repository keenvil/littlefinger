(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
	typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
	(factory((global.L = {}),global._));
}(this, (function (exports,_) { 'use strict';

_ = _ && _.hasOwnProperty('default') ? _['default'] : _;

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Thin layer on top of the global fetch object to make
 * HTTP requests
 */
var Http = function () {
  function Http() {
    classCallCheck(this, Http);
  }

  createClass(Http, [{
    key: 'post',
    value: function post(headers, url, body) {
      return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });
    }
  }, {
    key: 'get',
    value: function get$$1(headers, url) {
      return fetch(url, {
        method: 'GET',
        headers: headers
      });
    }
  }, {
    key: 'put',
    value: function put(headers, url, body) {
      return fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
      });
    }
  }, {
    key: 'delete',
    value: function _delete(headers, url) {
      return fetch(url, {
        method: 'DELETE',
        headers: headers
      });
    }
  }]);
  return Http;
}();

var KeenvilApiError = function (_Error) {
  inherits(KeenvilApiError, _Error);

  function KeenvilApiError() {
    var _ref;

    classCallCheck(this, KeenvilApiError);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = possibleConstructorReturn(this, (_ref = KeenvilApiError.__proto__ || Object.getPrototypeOf(KeenvilApiError)).call.apply(_ref, [this].concat(args)));

    _this.apiErrors = [];

    Error.captureStackTrace(_this, KeenvilApiError);
    return _this;
  }

  return KeenvilApiError;
}(Error);

/**
 * Class to make HTTP Rest calls to Keenvil's API.
 *
 * This is the place to add common behavior to all requests to
 * Keenvil API. Like general error handling.
 *
 * By default will use Http transport to perform requests
 * to Keenvil's API.
 */

var Rest = function () {
  function Rest(config) {
    classCallCheck(this, Rest);
    this.keenvilApiSuccessfulResponses = {
      SUCCESS: 200,
      CREATED: 201,
      DELETED: 204
    };
    this.keenvilApiErrors = {
      SESSION_EXPIRED: 401,
      ACCESS_FORBIDDEN: 403,
      RESOURCE_NOT_FOUND: 404,
      ENTITY_NOT_FOUND: 412,
      UNSUPPORTED_MEDIA_TYPE: 415,
      VALIDATION_ERROR: 422
    };
    this.serverErrors = {
      INTERNAL_ERROR: 500
    };

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
    var mergedConfig = _.merge(defaultConfig, config);

    this.apiConfig = mergedConfig.apiConfig;
    this.communityId = mergedConfig.communityId;
    this.token = mergedConfig.token;
    this.module = mergedConfig.module;
    this.transport = mergedConfig.transport;
    this.pushToken = mergedConfig.pushToken;
    this.applicationId = mergedConfig.applicationId;
    this.operatingSystem = mergedConfig.operatingSystem;
  }

  createClass(Rest, [{
    key: 'isResponseSerializable',
    value: function isResponseSerializable(statusCode) {
      return _.values(this.keenvilApiSuccessfulResponses).includes(statusCode) || _.values(this.keenvilApiErrors).includes(statusCode);
    }
  }, {
    key: 'isSessionExpired',
    value: function isSessionExpired(status) {
      return status === this.keenvilApiErrors.SESSION_EXPIRED;
    }
  }, {
    key: 'buildError',
    value: function buildError(errorPayload) {
      var error = new KeenvilApiError();
      error.apiErrors = errorPayload;
      return error;
    }

    /**
     * This method will try to serialize the response into JSON while
     * throwing errors based on the response status code.
     *
     * @param {Object} response fetch Response object
     */

  }, {
    key: 'processResponse',
    value: function processResponse(response) {
      var _this = this;

      var isJsonResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!response.ok && !this.isResponseSerializable(response.status)) {
        throw this.buildError([{
          code: response.statusText ? response.statusText : response.status
        }]);
      }
      if (this.isSessionExpired(response.status)) {
        throw this.buildError([{
          code: 'sessionHasBeenExpired'
        }]);
      }
      var unserializedResult = isJsonResponse ? response.json() : response.text();
      return unserializedResult.then(function (unserializedResponse) {
        if (!response.ok) {
          throw _this.buildError(unserializedResponse);
        }
        return unserializedResponse;
      });
    }
  }, {
    key: 'getBaseUrl',
    value: function getBaseUrl() {
      var baseUrl = this.apiConfig.getBaseUrl();
      if (baseUrl) {
        return baseUrl;
      } else {
        throw new Error('The api config method must have a getBaseUrl\n      method that returns a valid url');
      }
    }

    /**
     * Returns headers for an HTTP request.
     * @param {Bool} isPost adds headers for POST requests
     */

  }, {
    key: 'getHeaders',
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
    key: 'buildUrl',
    value: function buildUrl(path) {
      var url = this.getBaseUrl();

      if (this.module) {
        url = url + '/' + this.module;
      }

      if (this.communityId) {
        url = url + '/c/' + this.communityId;
      }

      return url + '/' + path;
    }

    /**
     * Builds the query string to append to a resource URL
     *
     * @param {Object} query
     * @returns a string with the parameters escaped and concatenated
     */

  }, {
    key: 'buildQueryString',
    value: function buildQueryString(query) {
      return Object.keys(query).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(query[k]);
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
    key: 'save',
    value: function save(path, entity) {
      var _this2 = this;

      var isJsonResponse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var url = this.buildUrl(path);
      return this.transport.post(this.getHeaders(true), url, entity).then(function (response) {
        return _this2.processResponse(response, isJsonResponse);
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
    key: 'update',
    value: function update(path, entity) {
      var _this3 = this;

      var isJsonResponse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var url = this.buildUrl(path);
      return this.transport.put(this.getHeaders(true), url, entity).then(function (response) {
        return _this3.processResponse(response, isJsonResponse);
      });
    }

    /**
     * Find all entities for a resource in a given path
     *
     * @param {String} path to the resource
     * @returns a promise that resolves to a Response (see fetch) object
     */

  }, {
    key: 'find',
    value: function find(path) {
      var _this4 = this;

      var isJsonResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var url = this.buildUrl(path);
      return this.transport.get(this.getHeaders(false), url).then(function (response) {
        return _this4.processResponse(response, isJsonResponse);
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
    key: 'query',
    value: function query(path) {
      var _this5 = this;

      var _query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var isJsonResponse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var baseUrl = this.buildUrl(path);
      var url = baseUrl + '?' + this.buildQueryString(_query);
      return this.transport.get(this.getHeaders(true), url).then(function (response) {
        return _this5.processResponse(response, isJsonResponse);
      });
    }

    /**
     * Deletes an entity using the API
     *
     * @param {String} path to the resource
     * @returns a promise that resolves to a Response (see fetch) object
     */

  }, {
    key: 'delete',
    value: function _delete(path) {
      var _this6 = this;

      var isJsonResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var url = this.buildUrl(path);
      return this.transport.delete(this.getHeaders(true), url).then(function (response) {
        return _this6.processResponse(response, isJsonResponse);
      });
    }
  }]);
  return Rest;
}();

var ApiModule = function ApiModule(name) {
  classCallCheck(this, ApiModule);
  this.adapter = null;
  this.name = '';

  this.adapter = new Rest({
    module: name
  });
  this.name = name;
};

var ModuleRegistry = function () {
  function ModuleRegistry() {
    classCallCheck(this, ModuleRegistry);
    this.modules = null;

    this.modules = new Map();
  }

  createClass(ModuleRegistry, [{
    key: "addModule",
    value: function addModule(moduleName, moduleDefinition) {
      if (!this.modules.has(moduleName)) {
        this.modules.set(moduleName, moduleDefinition);
      } else {
        throw new Error("Littlefinger: there is already a module with name " + moduleName);
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

exports.Rest = Rest;
exports.KeenvilApiError = KeenvilApiError;
exports.ApiModule = ApiModule;
exports.ModuleRegistry = ModuleRegistry;

Object.defineProperty(exports, '__esModule', { value: true });

})));
