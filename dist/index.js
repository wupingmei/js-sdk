'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _constants = require('./constants');

var _emitter = require('./event/emitter');

var _emitter2 = _interopRequireDefault(_emitter);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

require('whatwg-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@private symbol clientApiVersion
 */


/* @dependencies */
var clientApiVersion = Symbol();

/**
 *	@private symbol clientApiToken
 */
var clientApiToken = Symbol();

/**
 *	@private symbol sandboxFixtures
 */
var sandboxFixtures = Symbol();

/**
 *	@private symbol sandboxMocks
 */
var sandboxMocks = Symbol();

/**
 *	@const array ENDPOINT_BEARER_WHITELIST
 */
var ENDPOINT_BEARER_WHITELIST = [['POST', 'auth'], ['POST', 'users']];

/**
 *	@type RequestHeaders
 *	Key, value map of request headers.
 */

/** @NOTE There's an open issue with computed properties and Flow - https://github.com/facebook/flow/issues/252 */

/**
 *	ThreeSixtyInterface
 *
 *	Handles interaction with public 360Player APIs. 
 */
var ThreeSixtyInterface = function (_EventEmitter) {
	(0, _inherits3.default)(ThreeSixtyInterface, _EventEmitter);

	/**
  *	@constructor
  *
  *	Sets required instance variables.
  *
  *	@param string apiVersion
  *
  *	@return void
  */


	/**
 	 *	@property string apiEndpointUrl
  */


	/**
 	 *	@property boolean isSandboxed
  */
	function ThreeSixtyInterface(apiVersion) {
		(0, _classCallCheck3.default)(this, ThreeSixtyInterface);

		// @FLOWFIXME
		var _this = (0, _possibleConstructorReturn3.default)(this, (ThreeSixtyInterface.__proto__ || Object.getPrototypeOf(ThreeSixtyInterface)).call(this));

		_this.isConnected = false;
		_this.isSandboxed = false;
		_this.inDebugMode = false;
		_this[clientApiVersion] = apiVersion;

		// @FLOWFIXME
		_this[clientApiToken] = null;

		_this.apiEndpointUrl = _constants.API_ENDPOINT_URL;
		return _this;
	}

	/**
  *	Sets sandboxed mode, regardless of previous mode.
  *
  *	@param object requestFixtures
  *	@param object requestMocks
  *
  *	@return void
  */


	/**
  *	@static object defaultRequestHeaders
  */


	/**
 	 *	@property boolean inDebugMode
  */


	/**
 	 *	@property boolean isConnected
  */


	(0, _createClass3.default)(ThreeSixtyInterface, [{
		key: 'sandboxed',
		value: function sandboxed(requestFixtures, requestMocks) {
			this.isSandboxed = true;

			// @FLOWFIXME
			this[sandboxFixtures] = requestFixtures;

			// @FLOWFIXME
			this[sandboxMocks] = requestMocks;

			this.log('info', 'Activated sandbox mode.');
		}

		/**
   *	Sets debug mode which logs various things from class.
   *
  	 *	@return void
   */

	}, {
		key: 'debugMode',
		value: function debugMode() {
			this.inDebugMode = true;
			this.log('info', 'Activated debug mode.');
		}

		/**
   *	Logs message if {@see ThreeSixtyInterface#inDebugMode} is true.
   *
   *	@param string logType
   *	@param any logSource
   *	@param any, ... additionalParameters
   */

	}, {
		key: 'log',
		value: function log(logType, logSource) {
			if (this.inDebugMode === true && console !== undefined) {
				for (var _len = arguments.length, additionalParameters = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
					additionalParameters[_key - 2] = arguments[_key];
				}

				if (additionalParameters.length > 0) {
					var _console;

					(_console = console)[logType].apply(_console, [logSource].concat(additionalParameters));
				} else {
					console[logType](logSource);
				}
			}
		}

		/**
   *	@propertyGetter apiVersion
   *
   *	@return string
   */

	}, {
		key: 'request',


		/**
   *	@async request
   *
   *	Attempts to make a new request to endpoint, if sandbox mode is active and fixtures are present, a resolved promise is returned.
   *
   *	@param string endpointUri
   *	@param string requestMethod
   *	@param object|null payload
   *	@param RequestHeaders|null additionalHeaders
   *
   *	@return Promise
   */
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(endpointUri) {
				var requestMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "GET";
				var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

				var _this2 = this;

				var additionalHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
				var uriOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
				var body, headers, fixtureKey, fixture, mock, mode, method, requestOptions, returnedPromise;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								body = JSON.stringify(payload);
								headers = Object.assign(additionalHeaders, ThreeSixtyInterface.defaultRequestHeaders);

								endpointUri = ('' + endpointUri.toLowerCase()).replace(/\/+/g, '/').replace(/\/+$/, '');

								// @NOTE Only pass Authorization header if applicable
								ENDPOINT_BEARER_WHITELIST.forEach(function (whitelist) {
									var _whitelist = (0, _slicedToArray3.default)(whitelist, 2),
									    method = _whitelist[0],
									    uri = _whitelist[1];

									var isWhitelisted = requestMethod === method && endpointUri === uri;

									// @FLOWFIXME
									if (isWhitelisted === false && typeof _this2[clientApiToken] === 'string') {
										headers['Authorization'] = 'Bearer ' + _this2[clientApiToken];
										return false;
									}
								});

								// @NOTE Append URI options to endpointUri
								if (uriOptions && Object.keys(uriOptions).length > 0) {
									endpointUri += '?' + _queryString2.default.stringify(uriOptions);
								}

								this.emit('request');

								// @NOTE Capture sandboxed mode

								if (!this.isSandboxed) {
									_context.next = 20;
									break;
								}

								fixtureKey = requestMethod.toUpperCase() + ' /' + this.apiVersion + '/' + endpointUri;

								// @FLOWFIXME

								if (!(this[sandboxFixtures] === null)) {
									_context.next = 10;
									break;
								}

								throw Error("Sandbox mode requires fixtures to be set.");

							case 10:
								if (!(this[sandboxFixtures].hasOwnProperty(fixtureKey) === false)) {
									_context.next = 12;
									break;
								}

								throw Error('Fixture for request ' + fixtureKey + ' not found.');

							case 12:

								// @FLOWFIXME
								fixture = this[sandboxFixtures][fixtureKey];

								// @FLOWFIXME

								if (!(this[sandboxMocks] === null)) {
									_context.next = 15;
									break;
								}

								throw Error("Sandbox mode requires mock functions to be set.");

							case 15:
								if (!(this[sandboxMocks].hasOwnProperty(fixtureKey) === false)) {
									_context.next = 17;
									break;
								}

								throw Error('Mock function for request ' + fixtureKey + ' not found.');

							case 17:

								// @FLOWFIXME
								mock = this[sandboxMocks][fixtureKey];


								this.log('debug', 'Requesting mocked "' + requestMethod + ' /' + this.apiEndpointUrl + '/' + this.apiVersion + '/' + endpointUri + '"');

								return _context.abrupt('return', new Promise(function (resolve, reject) {
									if (mock(payload) === true) {
										resolve({
											ok: true,
											json: function json() {
												return fixture;
											},
											text: function text() {
												return JSON.stringify(fixture);
											}
										});
									} else {
										var mockError = { error: "Mock function failed." };

										resolve({
											ok: false,
											json: function json() {
												return mockError;
											},
											text: function text() {
												return JSON.stringify(mockError);
											}
										});
									}
								}));

							case 20:
								mode = 'cors';
								method = requestMethod;
								requestOptions = { mode: mode, body: body, headers: headers, method: method };

								// @NOTE Body is not allowed for HEAD and GET requests

								if (requestMethod === 'GET' || requestMethod === 'HEAD') {
									delete requestOptions.body;
								}

								returnedPromise = fetch(this.apiEndpointUrl + '/' + this.apiVersion + '/' + endpointUri, requestOptions);

								// @NOTE Do not expose body to log

								delete requestOptions.body;

								this.log('debug', 'Requesting "' + requestMethod + ' /' + this.apiVersion + '/' + endpointUri + '"', requestOptions);

								return _context.abrupt('return', returnedPromise);

							case 28:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function request(_x) {
				return _ref.apply(this, arguments);
			}

			return request;
		}()

		/**
   *	@async connectWithPayload
   *
   *	Attempts to connect to authentication endpoint, sends payload.
   *
  	 *	@param object payload
   *	@param object uriOptions
   *
   *	@emits 'connect'
   *
   *	@return Promise
   */

	}, {
		key: 'connectWithPayload',
		value: function () {
			var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(payload, uriOptions) {
				var response, data;
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.request('auth', 'POST', payload, {}, uriOptions);

							case 2:
								response = _context2.sent;
								_context2.next = 5;
								return response.json();

							case 5:
								data = _context2.sent;

								if (!(data !== undefined && data.token)) {
									_context2.next = 13;
									break;
								}

								this.isConnected = true;
								this.useToken(data.token);

								_context2.next = 11;
								return this.emit('connect');

							case 11:
								_context2.next = 15;
								break;

							case 13:
								_context2.next = 15;
								return this.disconnect();

							case 15:
								return _context2.abrupt('return', response);

							case 16:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function connectWithPayload(_x6, _x7) {
				return _ref2.apply(this, arguments);
			}

			return connectWithPayload;
		}()

		/**
   *	@async connect
   *
   *	Attempts to connect with user credentials.
   *
  	 *	@param string username
   *	@param string password
   *
   *	@emits 'connect'
   *
   *	@return Promise
   */

	}, {
		key: 'connect',
		value: function () {
			var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(username, password) {
				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return this.connectWithPayload({ username: username, password: password });

							case 2:
								return _context3.abrupt('return', _context3.sent);

							case 3:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function connect(_x8, _x9) {
				return _ref3.apply(this, arguments);
			}

			return connect;
		}()

		/**
   *	@async connect
   *
   *	Attempts to connect with Facebook access code.
   *
  	 *	@param string authToken
   *	@param string redirectUri
   *
   *	@emits 'connect'
   *
   *	@return Promise
   */

	}, {
		key: 'connectWithFacebook',
		value: function () {
			var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(authToken, redirectUri) {
				return _regenerator2.default.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return this.connectWithPayload({
									code: authToken,
									redirect_uri: redirectUri
								}, { medium: 'facebook' });

							case 2:
								return _context4.abrupt('return', _context4.sent);

							case 3:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function connectWithFacebook(_x10, _x11) {
				return _ref4.apply(this, arguments);
			}

			return connectWithFacebook;
		}()

		/**
   *	Sets default null values for connection status and removes authentication token.
   *
   *	@emits 'disconnect'
   *
   *	@return void
   */

	}, {
		key: 'disconnect',
		value: function disconnect() {
			// @FLOWFIXME
			this[clientApiToken] = null;

			this.isConnected = false;
			this.emit('disconnect');
			this.log('info', 'Disconnected');
		}

		/**
  	 *	Sets JWT token for current instance. If user is not connected, connection status is set to true and event emits.
   *
   *	@param string apiToken
   *
   *	@emits 'connect'
   *
   *	@return void
   */

	}, {
		key: 'useToken',
		value: function useToken(apiToken) {
			// @FLOWFIXME
			this[clientApiToken] = apiToken;

			if (this.isConnected === false) {
				this.isConnected = true;
				this.emit('connect');
				this.log('info', 'Connected');
			}
		}

		/**
   *	Overrides API endpoint URL.
   *
   *	@param string newApiEndpointUrl
   *
   *	@return void
   */

	}, {
		key: 'useEndpoint',
		value: function useEndpoint(newApiEndpointUrl) {
			this.log('info', "Changed endpoint from ${this.apiEndpointUrl} to ${newApiEndpointUrl}");
			this.apiEndpointUrl = newApiEndpointUrl;
		}
	}, {
		key: 'apiVersion',
		get: function get() {
			// @FLOWFIXME
			return this[clientApiVersion];
		}

		/**
   *	@propertyGetter clientToken
   *
   *	@return string|null
   */

	}, {
		key: 'clientToken',
		get: function get() {
			// @FLOWFIXME
			return this[clientApiToken];
		}
	}]);
	return ThreeSixtyInterface;
}(_emitter2.default);

ThreeSixtyInterface.defaultRequestHeaders = {
	'Content-Type': 'application/json'
};
exports.default = ThreeSixtyInterface;