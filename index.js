'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sessionFetchTokenPolicy = exports.sessionStoreTokenPolicy = undefined;

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connection = new _connection2.default();

/* @dependencies */
exports.default = connection;
exports.sessionStoreTokenPolicy = _connection.sessionStoreTokenPolicy;
exports.sessionFetchTokenPolicy = _connection.sessionFetchTokenPolicy;