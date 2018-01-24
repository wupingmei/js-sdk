'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _session = require('./policies/session');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* @dependencies */
var connection = new _connection2.default();

// @NOTE Set default token policies
connection.setTokenPolicies(_session.sessionStoreTokenPolicy, _session.sessionFetchTokenPolicy);

exports.default = connection;