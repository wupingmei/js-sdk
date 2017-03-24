'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@private symbol clientApiVersion
 */


/* @dependencies */
var clientApiVersion = Symbol();

/**
 *	@private symbol clientApiKey
 */
var clientApiKey = Symbol();

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
  *	@param string apiKey
  *
  *	@return void
  */


	/**
 	 *	@property boolean isSandboxed
  */
	function ThreeSixtyInterface(apiVersion, apiKey) {
		(0, _classCallCheck3.default)(this, ThreeSixtyInterface);

		var _this = (0, _possibleConstructorReturn3.default)(this, (ThreeSixtyInterface.__proto__ || Object.getPrototypeOf(ThreeSixtyInterface)).call(this));

		_this.isConnected = false;
		_this.isSandboxed = false;

		// @FLOWFIXME
		_this[clientApiVersion] = apiVersion;

		// @FLOWFIXME
		_this[clientApiKey] = apiKey;

		// @FLOWFIXME
		_this[clientApiToken] = null;
		return _this;
	}

	/**
  *	sandboxed
  *
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
   *	@param string endpointUrl
   *	@param string requestMethod
   *	@param object|null payload
   *	@param RequestHeaders|null additionalHeaders
   *
   *	@return Promise
   */
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(endpointUrl) {
				var requestMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "GET";
				var payload = arguments[2];
				var additionalHeaders = arguments[3];
				var body, headers, fixtureKey, fixture, mock;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								body = JSON.stringify(payload);
								headers = Object.assign(ThreeSixtyInterface.defaultRequestHeaders, {
									// @FLOWFIXME
									'X-API-Key': this[clientApiKey]
								});


								requestMethod = requestMethod.toUpperCase();
								endpointUrl = ('' + endpointUrl.toLowerCase()).replace(/\/+/g, '/').replace(/\/+$/, '');

								// @NOTE Only pass Authorization header if applicable
								if (requestMethod === 'POST' && (endpointUrl === 'auth' || endpointUrl === 'users') === false) {
									// @FLOWFIXME
									headers['Authorization'] = 'Bearer ' + this[clientApiToken];
								}

								this.emit('request');

								if (!this.isSandboxed) {
									_context.next = 19;
									break;
								}

								fixtureKey = requestMethod.toUpperCase() + ' /' + this.apiVersion + '/' + endpointUrl;

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

							case 19:
								return _context.abrupt('return', fetch(_constants.API_ENDPOINT_URL + '/' + this.apiVersion + '/' + endpointUrl, {
									body: body, headers: headers, requestMethod: requestMethod.toUpperCase()
								}));

							case 20:
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
   *	@async connect
   *
   *	Attempts to connect to authentication endpoint.
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
			var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(username, password) {
				var response, data;
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.request('auth', 'post', { username: username, password: password });

							case 2:
								response = _context2.sent;
								_context2.next = 5;
								return response.json();

							case 5:
								data = _context2.sent;

								if (!(response.ok && data && data.token)) {
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

			function connect(_x3, _x4) {
				return _ref2.apply(this, arguments);
			}

			return connect;
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
			}
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