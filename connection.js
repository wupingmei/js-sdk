'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _omit = require('js-toolkit/omit');

var _omit2 = _interopRequireDefault(_omit);

var _parser = require('js-toolkit/url/parser');

var _parser2 = _interopRequireDefault(_parser);

var _policies = require('./policies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@const array API_VERSION_LIST
 */


/* @type-dependencies */


/**
 *	@type ApiVersionType
 *	@TODO Add (UNION) for additional versions, e.g. "v1" | "v2"
 */


/**
 *	@type RequestMethodType
 */


/**
 *	@type RequestOptionsType
 */


/**
 *	@type RequestHeadersType
 */


/**
 *	@type UnauthorizedRequestsType
 */
var API_VERSION_LIST = ['v1'];

/**
 *	@const UnauthorizedRequestsType API_UNAUTHORIZED_REQUESTS
 */


/* @dependencies */
var API_UNAUTHORIZED_REQUESTS = {
	'/auth': ['POST'],
	'/users': ['POST']
};

/**
 *	HTTP Request error.
 *	@extends Error
 */

var RequestError = function (_Error) {
	(0, _inherits3.default)(RequestError, _Error);

	function RequestError() {
		(0, _classCallCheck3.default)(this, RequestError);
		return (0, _possibleConstructorReturn3.default)(this, (RequestError.__proto__ || Object.getPrototypeOf(RequestError)).apply(this, arguments));
	}

	return RequestError;
}(Error);

/**
 *	@const UrlParser urlParser
 */


var urlParser = new _parser2.default();

/**
 *	SDK Connection interface, holds token store and fetch policies.
 */

var Connection = function () {
	function Connection() {
		(0, _classCallCheck3.default)(this, Connection);
		this.apiVersion = 'v1';
		this.endpointUrl = 'https://api.360player.com';
		this.requestOptions = {};
		this.requestHeaders = {
			'Content-Type': 'application/json'
		};
		this.requestPayload = {};
		this.shouldIncludeAuthorizationHeader = true;
	}

	/**
  *	@var ApiVersionType apiVersion
  */


	/**
  *	@var string endpointUrl
  */


	/**
  *	@var RequestOptionsType requestOptions
  */


	/**
  *	@var Function storeTokenPolicyCallback
  */


	/**
  *	@var Function fetchTokenPolicyCallback
  */


	/**
  *	@var RequestHeadersType requestHeaders
  */


	/**
  *	@var JsonPropertyObjectType requestPayload
  */


	/**
  *	@var boolean shouldIncludeAuthorizationHeader
  */


	(0, _createClass3.default)(Connection, [{
		key: 'setApiVersion',


		/**
   *	Sets API version to prepend API calls with.
   *
   *	@param ApiVersionType apiVersion
   *
   *	@return boolean
   */
		value: function setApiVersion(apiVersion) {
			if (API_VERSION_LIST.includes(apiVersion)) {
				this.apiVersion = apiVersion;
				return true;
			}

			return false;
		}

		/**
   *	Returns (client) API version, falls back to default ("v1").
   *
   *	@return string
   */

	}, {
		key: 'getApiVersion',
		value: function getApiVersion() {
			return this.apiVersion;
		}

		/**
   *	Sets token store and fetch policies. Policy handlers are responsible for setting and getting token used in authenticated requests.
   *	Fetch policy *MUST* return Promise.
   *
   *	@param function storeTokenPolicyCallback
   *	@param function fetchTokenPolicyCallback
   *
   *	@throws InvalidTokenPolicyError
   *
   *	@return void
   */

	}, {
		key: 'setTokenPolicies',
		value: function setTokenPolicies(storeTokenPolicyCallback, fetchTokenPolicyCallback) {
			var isAsyncronousCallback = function isAsyncronousCallback(callback) {
				return callback.constructor.name === 'AsyncFunction' || callback.constructor.name === 'GeneratorFunction';
			};

			if (isAsyncronousCallback(storeTokenPolicyCallback)) {
				this.storeTokenPolicyCallback = storeTokenPolicyCallback;
			} else {
				throw new _policies.InvalidTokenPolicyError('Store token policy must be asyncronous function.');
			}

			if (isAsyncronousCallback(fetchTokenPolicyCallback)) {
				this.fetchTokenPolicyCallback = fetchTokenPolicyCallback;
			} else {
				throw new _policies.InvalidTokenPolicyError('Fetch token policy must be asyncronous function.');
			}
		}

		/**
   *	@prop boolean hasStoreTokenPolicy
   */

	}, {
		key: 'setToken',


		/**
   *	Attempts to set token, if set to null it should destroy existing token.
   *
   *	@param string accessToken
   *
   *	@throws MissingTokenPolicyError
   *
   *	@return Promise<boolean>
   */
		value: async function setToken(accessToken) {
			if (this.hasStoreTokenPolicy) {
				if (typeof accessToken === 'string') {
					return await this.storeTokenPolicyCallback(accessToken);
				} else if (accessToken === null) {
					// @NOTE Send "forceUnset" parameter to storeTokenPolicyCallback
					return await this.storeTokenPolicyCallback(accessToken, true);
				} else {
					throw new _policies.InvalidTokenError('Invalid token type, expected <string> got <' + (typeof accessToken === 'undefined' ? 'undefined' : (0, _typeof3.default)(accessToken)) + '>.');
				}
			} else {
				throw new _policies.MissingTokenPolicyError('Store token policy missing.');
			}
		}

		/**
   *	Attempts to get token.
   *
   *	@throws TokenNotSetError, MissingTokenPolicyError
   *
   *	@return Promise<string>
   */

	}, {
		key: 'getToken',
		value: async function getToken() {
			if (this.hasFetchTokenPolicy) {
				var accessToken = await this.fetchTokenPolicyCallback();

				if (typeof accessToken !== 'string') {
					throw new _policies.InvalidTokenError('Invalid token type, expected <string> got <' + (typeof accessToken === 'undefined' ? 'undefined' : (0, _typeof3.default)(accessToken)) + '>.');
				}

				return accessToken;
			} else {
				throw new _policies.MissingTokenPolicyError('Fetch token policy missing.');
			}
		}

		/**
   *	Validates whether or not token is set, unlike {@see getToken} it does not throw an error.
   *
   *	@return Promise<boolean>
   */

	}, {
		key: 'hasToken',
		value: async function hasToken() {
			try {
				var accessToken = await this.getToken();
				return Promise.resolve(!!accessToken);
			} catch (error) {
				return Promise.resolve(false);
			}
		}

		/**
   *	Alias for for unsetting token.
   *
   *	@return Promise<boolean>
   */

	}, {
		key: 'destroyToken',
		value: async function destroyToken() {
			return await this.setToken(null);
		}

		/**
   *	Sets internal request headers.
   *
   *	@param RequestHeadersType additionalRequestHeaders
   *
   *	@return boolean
   */

	}, {
		key: 'setRequestHeaders',
		value: function setRequestHeaders(additionalRequestHeaders) {
			this.requestHeaders = Object.assign(this.requestHeaders, additionalRequestHeaders);

			return true;
		}

		/**
   *	Returns internal request headers.
   *
   *	@return RequestHeadersType
   */

	}, {
		key: 'getRequestHeaders',
		value: function getRequestHeaders() {
			return this.requestHeaders;
		}

		/**
   *	Returns number of headers set.
   *
   *	@return number
   */

	}, {
		key: 'setRequestOptions',


		/**
   *	Sets internal request options to use with Fetch API.
   *
   *	@param RequestOptionsType additionalOptions
   *
   *	@return boolean
   */
		value: function setRequestOptions(additionalOptions) {
			additionalOptions = (0, _omit2.default)(additionalOptions, 'body');

			this.requestOptions = Object.assign(this.requestOptions, additionalOptions);

			return true;
		}

		/**
   *	Returns request options to use with Fetch API.
   *
   *	@return RequestOptionsType
   */

	}, {
		key: 'getRequestOptions',
		value: function getRequestOptions() {
			return this.requestOptions;
		}

		/**
   *	Returns options size (how many options currently set).
   *
   *	@return number
   */

	}, {
		key: 'setPayload',


		/**
   *	Appends items to payload.
   *
   *	@param JsonPropertyObjectType additionalPayload
   *	@param boolean removeNull
   *
   *	@return boolean
   */
		value: function setPayload(additionalPayload) {
			var removeNull = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.requestPayload = Object.assign(this.requestPayload, additionalPayload);

			if (removeNull === true) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = Object.entries(this.requestPayload)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
						    _key = _step$value[0],
						    value = _step$value[1];

						if (value === null) {
							delete this.requestPayload[_key];
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}

			return true;
		}

		/**
   *	Returns current payload.
   *
   *	@return JsonPropertyObjectType
   */

	}, {
		key: 'getPayload',
		value: function getPayload() {
			return this.requestPayload;
		}

		/**
   *	Validates if payload has property.
   *
   *	@param string payloadKey
   *
   *	@return boolean
   */

	}, {
		key: 'hasPayload',
		value: function hasPayload(payloadKey) {
			return this.requestPayload.hasOwnProperty(payloadKey);
		}

		/**
   *	Returns JSON string of current payload.
   *
   *	@return string
   */

	}, {
		key: 'getPayloadString',
		value: function getPayloadString() {
			return JSON.stringify(this.requestPayload);
		}

		/**
   *	Returns the size of current payload (how many properties set).
   *
   *	@return number
   */

	}, {
		key: 'useEndpoint',


		/**
   *	Sets API endpoint URL.
   *
   *	@param string endpointUrl
   *
   *	@return void
   */
		value: function useEndpoint(endpointUrl) {
			this.endpointUrl = endpointUrl.replace(/\/+$/, '');
		}

		/**
   *	Destroys current payload.
   *
   *	@return void
   */

	}, {
		key: 'destroyPayload',
		value: function destroyPayload() {
			var emptypPayload = {};
			this.requestPayload = emptypPayload;
		}

		/**
   *	Resolves URI pattern and params into absolute URL and validates authorization header requirement.
   *
   *	@param string uriPattern
   *	@param ParserParamsType uriParams
   *	@param RequestMethodType requestMethod
   *
   *	@return string
   */

	}, {
		key: 'resolveRequestUri',
		value: function resolveRequestUri(uriPattern) {
			var uriParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var requestMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

			var relativeUriPath = urlParser.transform(this.getApiVersion() + '/' + uriPattern, uriParams);
			var absolutePath = [this.endpointUrl, relativeUriPath].join('/');

			if (API_UNAUTHORIZED_REQUESTS.hasOwnProperty(uriPattern) && API_UNAUTHORIZED_REQUESTS[uriPattern].includes(requestMethod)) {
				this.shouldIncludeAuthorizationHeader = false;
			} else {
				this.shouldIncludeAuthorizationHeader = true;
			}

			return absolutePath;
		}

		/**
   *	Prepares request options and headers.
   *
   *	@param RequestOptionsType requestOptions
   *	@param RequestHeadersType requestHeaders
   *
   *	@return Promise
   */

	}, {
		key: 'prepareRequest',
		value: async function prepareRequest() {
			var requestOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var requestHeaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			this.setRequestOptions(requestOptions);

			var authorizationHeaders = {};

			if (this.shouldIncludeAuthorizationHeader === true) {
				var accessToken = await this.getToken();
				authorizationHeaders['Authorization'] = 'Bearer ' + accessToken;
			}

			this.setRequestHeaders(Object.assign(requestHeaders, authorizationHeaders));

			if (this.requestOptions.method === 'GET' || this.requestOptions.method === 'HEAD') {
				// @FLOWFIXME Ignore linting of {@see RequestOptionsType}.
				var nullBody = { body: null };
				this.setRequestOptions(nullBody);
			}

			return Promise.resolve([this.getRequestOptions(), this.getRequestHeaders()]);
		}

		/**
   *	Requests API based on set options.
   *
   *	@param string requestUrl
   *	@param RequestMethodType requestMethod
   *	@param JsonPropertyObjectType requestPayload
   *
   *	@return Promise
   */

	}, {
		key: 'request',
		value: async function request(requestUrl) {
			var requestMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
			var requestPayload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var defaultRequestOptions = { method: requestMethod };
			var defaultRequestHeaders = {};

			this.setPayload(requestPayload);

			if (requestMethod !== 'GET' || requestMethod !== 'HEAD') {
				this.requestOptions.body = this.getPayloadString();
			}

			// @FLOWFIXME Ignore linting of {@see RequestOptionsType}.

			var _ref = await this.prepareRequest(defaultRequestOptions, defaultRequestHeaders),
			    _ref2 = (0, _slicedToArray3.default)(_ref, 2),
			    requestOptions = _ref2[0],
			    requestHeaders = _ref2[1];

			requestOptions.headers = requestHeaders;

			var request = await fetch(requestUrl, requestOptions);

			if (!request.ok) {
				throw new RequestError(request.statusText);
			}

			var response = await request.json();

			this.destroyPayload();

			return response;
		}

		/**
   *	Alias function for GET requests.
   *
   *	@param string uriPattern
   *	@param ParserParamsType uriParams
   *	@param JsonPropertyObjectType requestPayload
   *
   *	@return Promise
   */

	}, {
		key: 'get',
		value: async function get(uriPattern) {
			var uriParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var requestPayload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var targetUrl = this.resolveRequestUri(uriPattern, uriParams, 'GET');
			return await this.request(targetUrl, 'GET', requestPayload);
		}

		/**
   *	Alias function for POST requests.
   *
   *	@param string uriPattern
   *	@param ParserParamsType uriParams
   *	@param JsonPropertyObjectType requestPayload
   *
   *	@return Promise
   */

	}, {
		key: 'post',
		value: async function post(uriPattern) {
			var uriParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var requestPayload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var targetUrl = this.resolveRequestUri(uriPattern, uriParams, 'POST');
			return await this.request(targetUrl, 'POST', requestPayload);
		}

		/**
   *	Alias function for PUT requests.
   *
   *	@param string uriPattern
   *	@param ParserParamsType uriParams
   *	@param JsonPropertyObjectType requestPayload
   *
   *	@return Promise
   */

	}, {
		key: 'put',
		value: async function put(uriPattern) {
			var uriParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var requestPayload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var targetUrl = this.resolveRequestUri(uriPattern, uriParams, 'PUT');
			return await this.request(targetUrl, 'PUT', requestPayload);
		}

		/**
   *	Alias function for PATCH requests.
   *
   *	@param string uriPattern
   *	@param ParserParamsType uriParams
   *	@param JsonPropertyObjectType requestPayload
   *
   *	@return Promise
   */

	}, {
		key: 'patch',
		value: async function patch(uriPattern) {
			var uriParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var requestPayload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var targetUrl = this.resolveRequestUri(uriPattern, uriParams, 'PATCH');
			return await this.request(targetUrl, 'PATCH', requestPayload);
		}

		/**
   *	Alias function for DELETE requests.
   *
   *	@param string uriPattern
   *	@param ParserParamsType uriParams
   *	@param JsonPropertyObjectType requestPayload
   *
   *	@return Promise
   */

	}, {
		key: 'delete',
		value: async function _delete(uriPattern) {
			var uriParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var requestPayload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var targetUrl = this.resolveRequestUri(uriPattern, uriParams, 'DELETE');
			return await this.request(targetUrl, 'DELETE', requestPayload);
		}
	}, {
		key: 'hasStoreTokenPolicy',
		get: function get() {
			return typeof this.storeTokenPolicyCallback === 'function';
		}

		/**
   *	@prop boolean hasFetchTokenPolicy
   */

	}, {
		key: 'hasFetchTokenPolicy',
		get: function get() {
			return typeof this.fetchTokenPolicyCallback === 'function';
		}
	}, {
		key: 'numRequestHeaders',
		get: function get() {
			return Object.keys(this.requestHeaders).length;
		}
	}, {
		key: 'optionsSize',
		get: function get() {
			return Object.keys(this.requestOptions).length;
		}
	}, {
		key: 'payloadSize',
		get: function get() {
			return Object.keys(this.requestPayload).length;
		}
	}]);
	return Connection;
}();

exports.default = Connection;