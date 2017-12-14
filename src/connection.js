/* @flow */

/* @dependencies */
import omit from 'js-toolkit/omit';
import UrlParser, { ParserParamsType } from 'js-toolkit/url/parser';

/**
 *	@type ApiVersionType
 *	@TODO Add (UNION) for additional versions, e.g. "v1" | "v2"
 */
type ApiVersionType = 'v1';

/**
 *	@type RequestOptionsType
 */
type RequestOptionsType = {
	method? : 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH',
	headers? : Headers | RequestHeadersType,
	body? : Blob | FormData | URLSearchParams | string,
	mode? : 'same-origin' | 'cors' | 'cors-with-forced-preflight' | 'no-cors',
	credentials? : 'same-origin' | 'omit' | 'no-cors',
	cache? : 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached',
	redirect? : 'follow' | 'error' | 'manual',
	referrer? : string,
	referrerPolicy? : 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'unsafe-url',
	integrity? : string,
	keepalive? : boolean,
	signal? : mixed
};

/**
 *	@type RequestHeadersType
 */
type RequestHeadersType = { [ key : string ] : string };

/**
 *	@type UnauthorizedRequestsType
 */
type UnauthorizedRequestsType = { [ key : string ] : Array<string> };

/**
 *	@const array API_VERSION_LIST
 */
const API_VERSION_LIST : Array<string> = [ 'v1' ];

/**
 *	@const UnauthorizedRequestsType API_UNAUTHORIZED_REQUESTS
 */
const API_UNAUTHORIZED_REQUESTS : UnauthorizedRequestsType = {
	'/auth' : [ 'POST' ],
	'/users' : [ 'POST' ]
};

/**
 *	Token reference type error.
 *	@extends Error
 */
class InvalidTokenError extends Error {}

/**
 *	Invalid token policy error.
 *	@extends Error
 */
class InvalidTokenPolicyError extends Error {}

/**
 *	Missing token policy error.
 *	@extends Error
 */
class MissingTokenPolicyError extends Error {}

/**
 *	HTTP Request error.
 *	@extends Error
 */
class RequestError extends Error {}

/**
 *	@const UrlParser urlParser
 */
const urlParser : UrlParser = new UrlParser();

/**
 *	@private
 *	@var string __connectionAccessToken
 */
let __connectionAccessToken : ?string;

/**
 *	Default store token policy.
 *
 *	@param string accessToken
 *
 *	@return Promise
 */
export async function sessionStoreTokenPolicy( accessToken : string | null, forceUnset : boolean = false ) : Promise<boolean> {
	if ( accessToken === null && forceUnset === true ) {
		__connectionAccessToken = undefined;
		return Promise.resolve( true );
	}

	if ( typeof accessToken === 'string' ) {
		__connectionAccessToken = accessToken;
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
	return new Promise(( resolve, reject ) => {
		if ( typeof __connectionAccessToken === 'string' && __connectionAccessToken.length > 0 ) {
			resolve( __connectionAccessToken );
		} else {
			reject( new InvalidTokenError( `Invalid token type, expected <string> got <${(typeof __connectionAccessToken)}>.` ) );
		}
	});
}

/**
 *	SDK Connection interface, holds token store and fetch policies.
 */
class Connection {

	/**
	 *	@var ApiVersionType apiVersion
	 */
	apiVersion : ApiVersionType = 'v1';

	/**
	 *	@var Function storeTokenPolicyCallback
	 */
	storeTokenPolicyCallback : Function;

	/**
	 *	@var Function fetchTokenPolicyCallback
	 */
	fetchTokenPolicyCallback : Function;

	/**
	 *	@var RequestOptionsType requestOptions
	 */
	requestOptions : RequestOptionsType = {};

	/**
	 *	@var RequestHeadersType requestHeaders
	 */
	requestHeaders : RequestHeadersType = {
		'Content-Type' : 'application/json'
	};

	/**
	 *	Sets API version to prepend API calls with.
	 *
	 *	@param ApiVersionType apiVersion
	 *
	 *	@return boolean
	 */
	setApiVersion( apiVersion : ApiVersionType ) : boolean {
		if ( API_VERSION_LIST.includes( apiVersion ) ) {
			this.apiVersion = apiVersion;
			return true;
		}

		return false;
	}

	/**
	 *	Returns (client) API version, falls back to default ("v1").
	 *
	 *	@return string
	 */
	getApiVersion() : string {
		return this.apiVersion;
	}

	/**
	 *	Sets token store and fetch policies. Policy handlers are responsible for setting and getting token used in authenticated requests.
	 *	Fetch policy *MUST* return Promise.
	 *
	 *	@param function storeTokenPolicyCallback
	 *	@param function fetchTokenPolicyCallback
	 *
	 *	@throws InvalidTokenPolicyError
	 *
	 *	@return void
	 */
	setTokenPolicies( storeTokenPolicyCallback : Function, fetchTokenPolicyCallback : Function ) {
		const isAsyncronousCallback : Function = ( callback : Function ) : boolean => {
			return ( callback.constructor.name === 'AsyncFunction' || callback.constructor.name === 'GeneratorFunction' );
		};

		if ( isAsyncronousCallback( storeTokenPolicyCallback ) ) {
			this.storeTokenPolicyCallback = storeTokenPolicyCallback;
		} else {
			throw new InvalidTokenPolicyError( 'Store token policy must be asyncronous function.' );
		}

		if ( isAsyncronousCallback( fetchTokenPolicyCallback ) ) {
			this.fetchTokenPolicyCallback = fetchTokenPolicyCallback;
		} else {
			throw new InvalidTokenPolicyError( 'Fetch token policy must be asyncronous function.' );
		}
	}

	/**
	 *	@prop boolean hasStoreTokenPolicy
	 */
	get hasStoreTokenPolicy() : boolean {
		return typeof this.storeTokenPolicyCallback === 'function';
	}

	/**
	 *	@prop boolean hasFetchTokenPolicy
	 */
	get hasFetchTokenPolicy() : boolean {
		return typeof this.fetchTokenPolicyCallback === 'function';
	}

	/**
	 *	Attempts to set token, if set to null it should destroy existing token.
	 *
	 *	@param string accessToken
	 *
	 *	@throws MissingTokenPolicyError
	 *
	 *	@return Promise<boolean>
	 */
	async setToken( accessToken : string | null ) : Promise<boolean> {
		if ( this.hasStoreTokenPolicy ) {
			if ( typeof accessToken === 'string' ) {
				return await this.storeTokenPolicyCallback( accessToken );
			} else if ( accessToken === null ) {
				// @NOTE Send "forceUnset" parameter to storeTokenPolicyCallback
				return await this.storeTokenPolicyCallback( accessToken, true );
			} else {
				throw new InvalidTokenError( `Invalid token type, expected <string> got <${(typeof accessToken)}>.` );
			}
		} else {
			throw new MissingTokenPolicyError( 'Store token policy missing.' );
		}
	}

	/**
	 *	Attempts to get token.
	 *
	 *	@throws TokenNotSetError, MissingTokenPolicyError
	 *
	 *	@return Promise<string>
	 */
	async getToken() : Promise<string> {
		if ( this.hasFetchTokenPolicy ) {
			let accessToken : string = await this.fetchTokenPolicyCallback();

			if ( typeof accessToken !== 'string' ) {
				throw new InvalidTokenError( `Invalid token type, expected <string> got <${(typeof accessToken)}>.` );
			}

			return accessToken;
		} else {
			throw new MissingTokenPolicyError( 'Fetch token policy missing.' );
		}
	}

	/**
	 *	Alias for for unsetting token.
	 *
	 *	@return Promise<boolean>
	 */
	async destroyToken() : Promise<boolean> {
		return await this.setToken( null );
	}

	/**
	 *	Sets internal request headers.
	 *
	 *	@param RequestHeadersType additionalRequestHeaders
	 *
	 *	@return void
	 */
	setRequestHeaders( additionalRequestHeaders : RequestHeadersType ) {
		this.requestHeaders = Object.assign(
			this.requestHeaders,
			additionalRequestHeaders
		);
	}

	/**
	 *	Returns internal request headers.
	 *
	 *	@return RequestHeadersType
	 */
	getRequestHeaders() : RequestHeadersType {
		return this.requestHeaders;
	}

}

// @NOTE Create a "singleton" instance and export it
const connection : Connection = new Connection();
export default connection;
