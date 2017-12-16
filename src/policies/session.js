/* @flow */

/* @dependencies */
import WeakStorage from 'js-toolkit/storage/weakstorage';
import { InvalidTokenError } from './index';

/**
 *	@const WeakStorage storage
 *	@NOTE Fallback for when sessionStorage is not present ()
 */
const storage : WeakStorage = new WeakStorage();

/**
 *	Returns either browser session storage or WeakStorage to store access token.
 *
 *	@return WeakStorage | Storage
 */
const storageAdapter : Function = () : WeakStorage | Storage => {
	if ( global.sessionStorage ) {
		return global.sessionStorage;
	}

	return storage;
};

/**
 *	@const string storageKey
 */
const storageKey : string = 'JS-SDK-ACCESS-TOKEN';

/**
 *	Default store token policy.
 *
 *	@param string accessToken
 *
 *	@return Promise
 */
export async function sessionStoreTokenPolicy( accessToken : string | null, forceUnset : boolean = false ) : Promise<boolean> {
	if ( accessToken === null && forceUnset === true ) {
		storageAdapter().removeItem( storageKey );
		return Promise.resolve( true );
	}

	if ( typeof accessToken === 'string' ) {
		storageAdapter().setItem( storageKey, accessToken );
		return Promise.resolve( true );
	}

	return Promise.resolve( false );
}

/**
 *	Default fetch token policy.
 *
 *	@return Promise
 */
export async function sessionFetchTokenPolicy() : Promise<string> {
	const accessToken = storageAdapter().getItem( storageKey );

	return new Promise(( resolve, reject ) => {
		if ( typeof accessToken === 'string' && accessToken.length > 0 ) {
			resolve( accessToken );
		} else {
			reject( new InvalidTokenError( `Invalid token type, expected <string> got <${(typeof accessToken)}>.` ) );
		}
	});
}
