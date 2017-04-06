'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ClientCookieJar = exports.ObjectCookieJar = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('weakmap-polyfill');

require('object.entries');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@private
 *	Attempts to encode unencoded string using encodeURIComponent.
 *
 *	@param any unencodedString
 *
 *	@return string
 */


/**
 *	@type CookieObject
 */


/* @dependencies */
function encode(unencodedString) {
	try {
		return encodeURIComponent(unencodedString);
	} catch (error) {
		return unencodedString;
	}
}

/**
 *	@private
 *	Attempts to decode encoded string using decodeURIComponent.
 *
 *	@param any encodedString
 *
 *	@return string
 */
function decode(encodedString) {
	try {
		return decodeURIComponent(encodedString);
	} catch (error) {
		return encodedString;
	}
}

/**
 *	Dummy cookie jar.
 */

var ObjectCookieJar = exports.ObjectCookieJar = function () {
	function ObjectCookieJar() {
		(0, _classCallCheck3.default)(this, ObjectCookieJar);
		this.jar = {};
	}

	(0, _createClass3.default)(ObjectCookieJar, [{
		key: 'cookie',
		set: function set(cookieHeader) {
			var actualCookieData = cookieHeader.split(/;(.+)/)[0];

			var _actualCookieData$spl = actualCookieData.split(/=(.+)/),
			    _actualCookieData$spl2 = (0, _slicedToArray3.default)(_actualCookieData$spl, 2),
			    name = _actualCookieData$spl2[0],
			    value = _actualCookieData$spl2[1];

			name = name.replace('=', '').trim();
			this.jar[name] = value;

			// @NOTE Remove if value is empty
			if (value === undefined) {
				delete this.jar[name];
			}
		},
		get: function get() {
			var cookieParts = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Object.entries(this.jar)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
					    _key = _step$value[0],
					    value = _step$value[1];

					cookieParts.push(encode(_key) + '=' + encode(value));
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

			return cookieParts.join(';');
		}
	}]);
	return ObjectCookieJar;
}();

/**
 *	Client cookie jar.
 */


var ClientCookieJar = exports.ClientCookieJar = function () {
	function ClientCookieJar() {
		(0, _classCallCheck3.default)(this, ClientCookieJar);
	}

	(0, _createClass3.default)(ClientCookieJar, [{
		key: 'cookie',
		set: function set(cookieHeader) {
			document.cookie = cookieHeader;
		},
		get: function get() {
			return document.cookie;
		}
	}]);
	return ClientCookieJar;
}();

/**
 *	@private
 *	@const WeakMap cookieJar
 *	@NOTE Cast WeakMap reference as Function since the Cookie class is static.
 */


var cookieJar = new WeakMap();

/**
 *	Cookie helper class.
 */

var Cookie = function () {
	function Cookie() {
		(0, _classCallCheck3.default)(this, Cookie);
	}

	(0, _createClass3.default)(Cookie, null, [{
		key: 'use',


		/**
   *	Sets new cookie jar, may be something like {@see CookieJar}-instance or document.cookie.
   *
   *	@oaram any newCookieJar
   *
   *	@return void
   */
		value: function use(newCookieJar) {
			cookieJar.set(Cookie, newCookieJar);
		}

		/**
   *	Parses a cookie string and casts it as an object.
   *
   *	@param string cookieString
   *
   *	@return CookieObject
   */

	}, {
		key: 'parse',
		value: function parse(cookieString) {
			var cookieObject = {};

			if (cookieString === undefined) {
				return cookieObject;
			}

			cookieString.replace(/([^\s,=]+)=([^,]+)(?=,|$)/g, function (match, key, value) {
				cookieObject[key] = decode(value);
				return value;
			});

			return cookieObject;
		}

		/**
   *	Stringifies an object into cookie string.
   *
   *	@param CookieObject cookieObject
   *
   *	@return string
   */

	}, {
		key: 'stringify',
		value: function stringify(cookieObject) {
			var name = cookieObject.name,
			    value = cookieObject.value;


			delete cookieObject.name;
			delete cookieObject.value;

			var cookieParts = [encode(name) + '=' + encode(value)];

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = Object.entries(cookieObject)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
					    _key2 = _step2$value[0],
					    _value = _step2$value[1];

					cookieParts.push(encode(_key2) + '=' + encode(_value));
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return cookieParts.join(';');
		}

		/**
   *	Sets a cookie.
   *
   *	@param string cookieIdentifier
   *	@param string cookieValue
   *	@param number cookieExpireDays
   *	@param object additionalCookieOptions
   *
   *	@return void
   */

	}, {
		key: 'set',
		value: function set(cookieIdentifier, cookieValue) {
			var cookieExpireDays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
			var additionalCookieOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

			var jar = cookieJar.get(Cookie);
			var expireDate = new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000).toUTCString();

			if (cookieExpireDays <= 0) {
				expireDate = new Date(0).toUTCString();
			}

			var cookieString = Cookie.stringify(Object.assign({
				name: cookieIdentifier,
				value: encode(cookieValue),
				expire: expireDate
			}, additionalCookieOptions));

			jar.cookie = cookieString;
		}

		/**
   *	Attempts to retrieve cookie value based on name.
   *
   *	@param string cookieIdentifier
   *
   *	@return string|undefined
   */

	}, {
		key: 'get',
		value: function get(cookieIdentifier) {
			var jar = cookieJar.get(Cookie);
			var parsedCookie = Cookie.parse(jar.cookie);
			return parsedCookie[cookieIdentifier];
		}

		/**
   *	Validates whether or not cookie exists or not.
   *
   *	@param string cookieIdentifier
   *
   *	@return bool
   */

	}, {
		key: 'has',
		value: function has(cookieIdentifier) {
			return Cookie.get(cookieIdentifier) !== undefined;
		}

		/**
   *	Removes cookie form jar.
   *
   *	@param string cookieIdentifier
   *
   *	@return void
   */

	}, {
		key: 'unset',
		value: function unset(cookieIdentifier) {
			Cookie.set(cookieIdentifier, "", 0);
		}

		/**
   *	Validates that cookie value matches expected value.
   *
   *	@param string cookieIdentifier
   *	@param string cookieValue
   *
   *	@return bool
   */

	}, {
		key: 'matches',
		value: function matches(cookieIdentifier, expectedCookieValue) {
			return Cookie.has(cookieIdentifier) === true && Cookie.get(cookieIdentifier) === expectedCookieValue;
		}
	}]);
	return Cookie;
}();

exports.default = Cookie;