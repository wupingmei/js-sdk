"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	Cookie helper class.
 */
var Cookie = function () {
	function Cookie() {
		(0, _classCallCheck3.default)(this, Cookie);
	}

	(0, _createClass3.default)(Cookie, null, [{
		key: "parse",


		/**
   *	@static
   *	Parses a cookie string and casts it as an object.
   *
   *	@param string cookieString
   *
   *	@return CookieObject
   */
		value: function parse(cookieString) {
			var cookieObject = {};

			cookieString.replace(/([^\s,=]+)=([^,]+)(?=,|$)/g, function (match, key, value) {
				cookieObject[key] = value;
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
		key: "stringify",
		value: function stringify(cookieObject) {
			var name = cookieObject.name,
			    value = cookieObject.value;


			delete cookieObject.name;
			delete cookieObject.value;

			var cookieParts = [name + "=" + value];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = Object.entries(cookieObject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
					    _key = _step$value[0],
					    _value = _step$value[1];

					cookieParts.push(_key + "=" + _value);
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

		/**
   *	
   */

	}, {
		key: "set",
		value: function set(cookieIdentifier, cookieData) {
			var cookieExpireDays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;

			var expireDate = new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000).toUTCString();
			var cookieString = cookieIdentifier + "=" + cookieData + "; expires=" + expireDate + "; path=/";
			document.cookie = cookieString;
		}
	}, {
		key: "get",
		value: function get(cookieIdentifier) {
			var parsedCookie = Cookie.parse(cookieIdentifier);
			return parsedCookie[cookieIdentifier];
		}
	}, {
		key: "destroy",
		value: function destroy(cookieIdentifier) {
			Cookie.set(cookieIdentifier, "", -1);
		}
	}]);
	return Cookie;
}();

/**
 *	@type CookieObject
 */


exports.default = Cookie;


function createCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}