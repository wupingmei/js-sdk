"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MissingTokenPolicyError = exports.InvalidTokenPolicyError = exports.InvalidTokenError = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *	Token reference type error.
 *	@extends Error
 */
var InvalidTokenError = exports.InvalidTokenError = function (_Error) {
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


var InvalidTokenPolicyError = exports.InvalidTokenPolicyError = function (_Error2) {
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


var MissingTokenPolicyError = exports.MissingTokenPolicyError = function (_Error3) {
  (0, _inherits3.default)(MissingTokenPolicyError, _Error3);

  function MissingTokenPolicyError() {
    (0, _classCallCheck3.default)(this, MissingTokenPolicyError);
    return (0, _possibleConstructorReturn3.default)(this, (MissingTokenPolicyError.__proto__ || Object.getPrototypeOf(MissingTokenPolicyError)).apply(this, arguments));
  }

  return MissingTokenPolicyError;
}(Error);