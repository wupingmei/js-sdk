'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *	@const string API_V1
 */
var API_V1 = exports.API_V1 = 'v1';

/**
 *	@const array AVAILABLE_API_VERSIONS
 */
var AVAILABLE_API_VERSIONS = [API_V1];

/**
 *	@const string API_ENDPOINT_URL
 */
var API_ENDPOINT_URL = exports.API_ENDPOINT_URL = 'https://api.360player.com';

/**
 *	@private symbol apiVersion
 */
var apiVersion = Symbol();

/**
 *	@private symbol apiKey
 */
var apiKey = Symbol();

/**
 *	Core class, handles initialization of API interaction.
 *
 *	@property string version
 */

var ThreeSixty = function () {

	/**
  *	Sets API version and API key.
  *
  *	@return void
  */

	function ThreeSixty(apiVersion, apiKey) {
		_classCallCheck(this, ThreeSixty);

		this.version = apiVersion;
		this[apiKey] = apiKey;
	}

	/**
  *	Attempts to set API version, only sets version if present in {@see AVAILABLE_API_VERSIONS}.
  *	@propertySetter version
  *
  *	@param string apiVersion
  *
  *	@return void
  */


	_createClass(ThreeSixty, [{
		key: 'version',
		set: function set(apiVersion) {
			if (AVAILABLE_API_VERSIONS.includes(apiVersion) === true) {
				this[apiVersion] = apiVersion;
			}
		}

		/**
   *	Returns current version.
   *	@propertyGetter version
   *
   *	@return string
   */
		,
		get: function get() {
			return this[apiVersion];
		}

		/**
   *	Returns instance API key.
   *	@propertyGetter apiKey
   *
   *	@return string 
   */

	}, {
		key: 'apiKey',
		get: function get() {
			return this[apiKey];
		}

		/**
   *	Returns resolved endpoint URL.
   *
   *	@return string
   */

	}, {
		key: 'endpointUrl',
		get: function get() {
			return API_ENDPOINT_URL + '/' + this.version + '/';
		}
	}]);

	return ThreeSixty;
}();

exports.default = ThreeSixty;