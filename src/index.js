/* @flow */

/* @dependencies */
import Connection from './connection';
import {
	sessionStoreTokenPolicy,
	sessionFetchTokenPolicy
} from './policies/session';

const connection : Connection = new Connection();

// @NOTE Set default token policies
connection.setTokenPolicies(
	sessionStoreTokenPolicy,
	sessionFetchTokenPolicy
);

export default connection;
