/* @flow */

/* @dependencies */
import Connection, {
	sessionStoreTokenPolicy,
	sessionFetchTokenPolicy
} from './connection';

const connection : Connection = new Connection();

export default connection;

export {
	sessionStoreTokenPolicy,
	sessionFetchTokenPolicy
};
