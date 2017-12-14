'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.sessionStoreTokenPolicy = sessionStoreTokenPolicy;
exports.sessionFetchTokenPolicy = sessionFetchTokenPolicy;

var _omit = require('js-toolkit/omit');

var _omit2 = _interopRequireDefault(_omit);

var _parser = require('js-toolkit/url/parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@const array API_VERSION_LIST
 */


/**
 *	@type ApiVersionType
 *	@TODO Add (UNION) for additional versions, e.g. "v1" | "v2"
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


/* @dependencies */
var API_VERSION_LIST = ['v1'];

/**
 *	@const UnauthorizedRequestsType API_UNAUTHORIZED_REQUESTS
 */
var API_UNAUTHORIZED_REQUESTS = {
	'/auth': ['POST'],
	'/users': ['POST']
};

/**
 *	Token reference type error.
 *	@extends Error
 */

var InvalidTokenError = function (_Error) {
	(0, _inherits3.default)(InvalidTokenError, _Error);

	function InvalidTokenError() {
		(0, _classCallCheck3.default)(this, InvalidTokenError);
		return (0, _possibleConstructorReturn3.default)(this, (InvalidTokenError.__proto__ || Object.getPrototypeOf(InvalidTokenError)).apply(this, arguments));
	}

	return InvalidTokenError;
}(Error);

/**
 *	Invalid token policy error.
 *	@extends Error
 */


var InvalidTokenPolicyError = function (_Error2) {
	(0, _inherits3.default)(InvalidTokenPolicyError, _Error2);

	function InvalidTokenPolicyError() {
		(0, _classCallCheck3.default)(this, InvalidTokenPolicyError);
		return (0, _possibleConstructorReturn3.default)(this, (InvalidTokenPolicyError.__proto__ || Object.getPrototypeOf(InvalidTokenPolicyError)).apply(this, arguments));
	}

	return InvalidTokenPolicyError;
}(Error);

/**
 *	Missing token policy error.
 *	@extends Error
 */


var MissingTokenPolicyError = function (_Error3) {
	(0, _inherits3.default)(MissingTokenPolicyError, _Error3);

	function MissingTokenPolicyError() {
		(0, _classCallCheck3.default)(this, MissingTokenPolicyError);
		return (0, _possibleConstructorReturn3.default)(this, (MissingTokenPolicyError.__proto__ || Object.getPrototypeOf(MissingTokenPolicyError)).apply(this, arguments));
	}

	return MissingTokenPolicyError;
}(Error);

/**
 *	HTTP Request error.
 *	@extends Error
 */


var RequestError = function (_Error4) {
	(0, _inherits3.default)(RequestError, _Error4);

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
 *	@private
 *	@var string __connectionAccessToken
 */
var __connectionAccessToken = void 0;

/**
 *	Default store token policy.
 *
 *	@param string accessToken
 *
 *	@return Promise
 */
async function sessionStoreTokenPolicy(accessToken) {
	var forceUnset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	if (accessToken === null && forceUnset === true) {
		__connectionAccessToken = undefined;
		return Promise.resolve(true);
	}

	if (typeof accessToken === 'string') {
		__connectionAccessToken = accessToken;
		return Promise.resolve(true);
	}

	return Promise.resolve(false);
}

/**
 *	Default fetch token policy.
 *
 *	@return Promise
 */
async function sessionFetchTokenPolicy() {
	return new Promise(function (resolve, reject) {
		if (typeof __connectionAccessToken === 'string' && __connectionAccessToken.length > 0) {
			resolve(__connectionAccessToken);
		} else {
			reject(new InvalidTokenError('Invalid token type, expected <string> got <' + (typeof __connectionAccessToken === 'undefined' ? 'undefined' : (0, _typeof3.default)(__connectionAccessToken)) + '>.'));
		}
	});
}

/**
 *	SDK Connection interface, holds token store and fetch policies.
 */

var Connection = function () {
	function Connection() {
		(0, _classCallCheck3.default)(this, Connection);
		this.apiVersion = 'v1';
		this.requestOptions = {};
		this.requestHeaders = {
			'Content-Type': 'application/json'
		};
	}

	/**
  *	@var ApiVersionType apiVersion
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
				throw new InvalidTokenPolicyError('Store token policy must be asyncronous function.');
			}

			if (isAsyncronousCallback(fetchTokenPolicyCallback)) {
				this.fetchTokenPolicyCallback = fetchTokenPolicyCallback;
			} else {
				throw new InvalidTokenPolicyError('Fetch token policy must be asyncronous function.');
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
					throw new InvalidTokenError('Invalid token type, expected <string> got <' + (typeof accessToken === 'undefined' ? 'undefined' : (0, _typeof3.default)(accessToken)) + '>.');
				}
			} else {
				throw new MissingTokenPolicyError('Store token policy missing.');
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
					throw new InvalidTokenError('Invalid token type, expected <string> got <' + (typeof accessToken === 'undefined' ? 'undefined' : (0, _typeof3.default)(accessToken)) + '>.');
				}

				return accessToken;
			} else {
				throw new MissingTokenPolicyError('Fetch token policy missing.');
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
   *	@return void
   */

	}, {
		key: 'setRequestHeaders',
		value: function setRequestHeaders(additionalRequestHeaders) {
			this.requestHeaders = Object.assign(this.requestHeaders, additionalRequestHeaders);
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
	}]);
	return Connection;
}();

// @NOTE Create a "singleton" instance and export it


var connection = new Connection();
exports.default = connection;