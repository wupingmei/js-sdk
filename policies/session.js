'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.sessionStoreTokenPolicy = sessionStoreTokenPolicy;
exports.sessionFetchTokenPolicy = sessionFetchTokenPolicy;

var _weakstorage = require('js-toolkit/storage/weakstorage');

var _weakstorage2 = _interopRequireDefault(_weakstorage);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	@const WeakStorage storage
 *	@NOTE Fallback for when sessionStorage is not present ()
 */


/* @dependencies */
var storage = new _weakstorage2.default();

/**
 *	Returns either browser session storage or WeakStorage to store access token.
 *
 *	@return WeakStorage | Storage
 */
var storageAdapter = function storageAdapter() {
	if (global.sessionStorage) {
		return global.sessionStorage;
	}

	return storage;
};

/**
 *	@const string storageKey
 */
var storageKey = 'JS-SDK-ACCESS-TOKEN';

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
		storageAdapter().removeItem(storageKey);
		return Promise.resolve(true);
	}

	if (typeof accessToken === 'string') {
		storageAdapter().setItem(storageKey, accessToken);
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
	var accessToken = storageAdapter().getItem(storageKey);

	return new Promise(function (resolve, reject) {
		if (typeof accessToken === 'string' && accessToken.length > 0) {
			resolve(accessToken);
		} else {
			reject(new _index.InvalidTokenError('Invalid token type, expected <string> got <' + (typeof accessToken === 'undefined' ? 'undefined' : (0, _typeof3.default)(accessToken)) + '>.'));
		}
	});
}