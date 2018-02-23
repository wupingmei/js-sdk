/* @flow */

/* @dependencies */
import omit from 'js-toolkit/omit';
import WeakStorage from 'js-toolkit/storage/weakstorage';
import UrlParser, { ParserParamsType } from 'js-toolkit/url/parser';
import {
	InvalidTokenError,
	InvalidTokenPolicyError,
	MissingTokenPolicyError
} from './policies';

/* @type-dependencies */
import type { JsonPropertyObjectType } from './generics';

/**
 *	@type ApiVersionType
 *	@TODO Add (UNION) for additional versions, e.g. "v1" | "v2"
 */
type ApiVersionType = 'v1';

/**
 *	@type RequestMethodType
 */
type RequestMethodType = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

/**
 *	@type RequestOptionsType
 */
type RequestOptionsType = {
	method? : RequestMethodType,
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
	'/users' : [ 'POST' ]
};

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
 *	SDK Connection interface, holds token store and fetch policies.
 */
export default class Connection {

	/**
	 *	@var ApiVersionType apiVersion
	 */
	apiVersion : ApiVersionType = 'v1';

	/**
	 *	@var string endpointUrl
	 */
	endpointUrl : string = 'https://api.360player.com';

	/**
	 *	@var string authenticationPath
	 */
	authenticationPath : string = '/auth';

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
	 *	@var JsonPropertyObjectType requestPayload
	 */
	requestPayload : JsonPropertyObjectType = {};

	/**
	 *	@var boolean debugMode
	 */
	debugMode : boolean = false;

	/**
	 *	@var WeakStorage cache
	 */
	cache = new WeakStorage();

	/**
	 *	Enable debug mode.
	 *
	 *	@return bool
	 */
	enableDebugMode() : boolean {
		this.debugMode = true;
		return this.debugMode;
	}

	/**
	 *	Disable debug mode.
	 *
	 *	@return bool
	 */
	disableDebugMode() : boolean {
		this.debugMode = false;
		return this.debugMode;
	}

	/**
	 *	Send debug to console.
	 *
	 *	@param mixed object
	 *
	 *	@return null
	 */
	debug( object : mixed ) : null {
		if ( this.debugMode === true ) {
			// eslint-disable-next-line no-console
			console.debug( object );
		}

		return null;
	}

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
	 *	Validates whether or not token is set, unlike {@see getToken} it does not throw an error.
	 *
	 *	@return Promise<boolean>
	 */
	async hasToken() : Promise<boolean> {
		try {
			const accessToken = await this.getToken();
			return Promise.resolve( !!accessToken );
		} catch ( error ) {
			return Promise.resolve( false );
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
	 *	@return boolean
	 */
	setRequestHeaders( additionalRequestHeaders : RequestHeadersType ) : boolean {
		this.requestHeaders = Object.assign(
			this.requestHeaders,
			additionalRequestHeaders
		);

		return true;
	}

	/**
	 *	Returns internal request headers.
	 *
	 *	@return RequestHeadersType
	 */
	getRequestHeaders() : RequestHeadersType {
		return this.requestHeaders;
	}

	/**
	 *	Returns number of headers set.
	 *
	 *	@return number
	 */
	get numRequestHeaders() : number {
		return Object.keys( this.requestHeaders ).length;
	}

	/**
	 *	Sets internal request options to use with Fetch API.
	 *
	 *	@param RequestOptionsType additionalOptions
	 *
	 *	@return boolean
	 */
	setRequestOptions( additionalOptions : RequestOptionsType ) : boolean {
		additionalOptions = omit( additionalOptions, 'body' );

		this.requestOptions = Object.assign(
			this.requestOptions,
			additionalOptions
		);

		return true;
	}

	/**
	 *	Returns request options to use with Fetch API.
	 *
	 *	@return RequestOptionsType
	 */
	getRequestOptions() : RequestOptionsType {
		return this.requestOptions;
	}

	/**
	 *	Returns options size (how many options currently set).
	 *
	 *	@return number
	 */
	get optionsSize() : number {
		return Object.keys( this.requestOptions ).length;
	}

	/**
	 *	Appends items to payload.
	 *
	 *	@param JsonPropertyObjectType additionalPayload
	 *	@param boolean removeNull
	 *
	 *	@return boolean
	 */
	setPayload( additionalPayload : JsonPropertyObjectType, removeNull : boolean = false ) : boolean {
		this.requestPayload = Object.assign(
			this.requestPayload,
			additionalPayload
		);

		if ( removeNull === true ) {
			for ( const [ key, value ] of Object.entries( this.requestPayload ) ) {
				if ( value === null ) {
					delete this.requestPayload[ key ];
				}
			}
		}

		return true;
	}

	/**
	 *	Returns current payload.
	 *
	 *	@return JsonPropertyObjectType
	 */
	getPayload() : JsonPropertyObjectType {
		return this.requestPayload;
	}

	/**
	 *	Validates if payload has property.
	 *
	 *	@param string payloadKey
	 *
	 *	@return boolean
	 */
	hasPayload( payloadKey : string ) : boolean {
		return this.requestPayload.hasOwnProperty( payloadKey );
	}

	/**
	 *	Returns JSON string of current payload.
	 *
	 *	@return string
	 */
	getPayloadString() : string {
		return JSON.stringify( this.requestPayload );
	}

	/**
	 *	Returns the size of current payload (how many properties set).
	 *
	 *	@return number
	 */
	get payloadSize() : number {
		return Object.keys( this.requestPayload ).length;
	}

	/**
	 *	Sets API endpoint URL.
	 *
	 *	@param string endpointUrl
	 *
	 *	@return void
	 */
	useEndpoint( endpointUrl : string ) {
		this.endpointUrl = endpointUrl.replace( /\/+$/, '' );
	}

	/**
	 *	Sets API authentication path.
	 *
	 *	@param string authenticationPath
	 *
	 *	@return void
	 */
	useAuthenticationPath( authenticationPath : string ) {
		this.authenticationPath = authenticationPath.replace( /\/+$/, '' );
	}

	/**
	 *	Destroys current payload.
	 *
	 *	@return void
	 */
	destroyPayload() {
		const emptypPayload : JsonPropertyObjectType = {};
		this.requestPayload = emptypPayload;
	}

	/**
	 *	Resolves URI pattern and params into absolute URL and validates authorization header requirement.
	 *
	 *	@param string uriPattern
	 *	@param ParserParamsType uriParams
	 *	@param RequestMethodType requestMethod
	 *
	 *	@return string
	 */
	resolveRequestUri( uriPattern : string, uriParams : ParserParamsType = {}, requestMethod : RequestMethodType = 'GET' ) : string {
		const relativeUriPath = urlParser.transform( uriPattern, uriParams );
		const isUnauthenticatedRequest =  API_UNAUTHORIZED_REQUESTS.hasOwnProperty( uriPattern ) && API_UNAUTHORIZED_REQUESTS[ uriPattern ].includes( requestMethod );

		return relativeUriPath;
	}

	/**
	 *	Prepares request options and headers.
	 *
	 *	@param RequestOptionsType requestOptions
	 *	@param RequestHeadersType requestHeaders
	 *
	 *	@return Promise
	 */
	async prepareRequest( requestOptions : RequestOptionsType = {}, requestHeaders : RequestHeadersType = {} ) : Promise<mixed> {
		this.setRequestOptions( requestOptions );

		const authorizationHeaders : RequestHeadersType = {};

		const accessToken = await this.getToken();

		if ( accessToken.length > 0 ) {
			authorizationHeaders[ 'Authorization' ] = `Bearer ${accessToken}`;
		}

		this.setRequestHeaders( Object.assign( requestHeaders, authorizationHeaders ) );

		if ( this.requestOptions.method === 'GET' || this.requestOptions.method === 'HEAD' ) {
			// @FLOWFIXME Ignore linting of {@see RequestOptionsType}.
			const nullBody : RequestOptionsType = { body : null };
			this.setRequestOptions( nullBody );
		}

		return Promise.resolve([
			this.getRequestOptions(),
			this.getRequestHeaders()
		]);
	}

	/**
	 *	Requests API based on set options. Returns Response promise.
	 *
	 *	@param string requestUrl
	 *	@param RequestMethodType requestMethod
	 *	@param JsonPropertyObjectType requestPayload
	 *
	 *	@return Promise
	 */
	async request( requestUrl : string, requestMethod : RequestMethodType = 'GET', requestPayload : JsonPropertyObjectType = {} ) : Promise<mixed> {
		const defaultRequestOptions : RequestOptionsType = { method : requestMethod };
		const defaultRequestHeaders : RequestHeadersType = {};

		this.setPayload( requestPayload );

		if ( requestMethod !== 'GET' || requestMethod !== 'HEAD' ) {
			this.requestOptions.body = this.getPayloadString();
		}

		// @FLOWFIXME Ignore linting of {@see RequestOptionsType}.
		const [ requestOptions, requestHeaders ] = await this.prepareRequest( defaultRequestOptions, defaultRequestHeaders );

		requestOptions.headers = requestHeaders;

		if ( requestMethod === 'GET' || requestMethod === 'HEAD' ) {
			delete requestOptions.body;
		}

		this.debug( requestOptions );

		requestUrl = [ this.endpointUrl, this.getApiVersion(), requestUrl ].join( '/' ).replace( /([^:])(\/\/+)/g, '$1/' );
		const request = await fetch( requestUrl , requestOptions );

		this.debug( request );

		this.destroyPayload();

		return request;
	}

	/**
	 *	Requests API based on set options. Returns JSON promise.
	 *
	 *	@param string requestUrl
	 *	@param RequestMethodType requestMethod
	 *	@param JsonPropertyObjectType requestPayload
	 *
	 *	@return Promise
	 */
	async requestJSON( requestUrl : string, requestMethod : RequestMethodType = 'GET', requestPayload : JsonPropertyObjectType = {} ) : Promise<mixed> {
		const response = await this.request( requestUrl, requestMethod, requestPayload );
		// @FLOWFIXME Variable response is mixed, and will fail unless ignored
		const result = await response.json();

		return result;
	}

	/**
	 *	Works as {@see Connection.request} but caches the response.
	 *
	 *	@param string requestUrl
	 *	@param RequestMethodType requestMethod
	 *	@param JsonPropertyObjectType requestPayload
	 *
	 *	@return Promise
	 */
	async cachedRequest( requestUrl : string, requestMethod : RequestMethodType = 'GET', requestPayload : JsonPropertyObjectType = {} ) : Promise<mixed> {
		const cachedResult = this.cache.getItem( `${requestMethod} ${requestUrl}` );

		if ( cachedResult !== null ) {
			return Promise.resolve({
				json : () => cachedResult
			});
		}

		const response = await this.request( requestUrl, requestMethod, requestPayload );

		// @FLOWFIXME Variable response is mixed, and will fail unless ignored
		const result = await response.json();

		this.cache.setItem( `${requestMethod} ${requestUrl}`, result );

		return response;
	}

	/**
	 *	Authentication request helper.
	 *
	 *	@param string username
	 *	@param string password
	 *
	 *	@return Promise
	 */
	async authenticate( username : string, password : string ) : Promise<mixed> {
		const requestPayload : JsonPropertyObjectType = { username, password };
		const authenticationPath = this.resolveRequestUri( this.authenticationPath, {}, 'POST' );
		const response : mixed = await this.request( authenticationPath, 'POST', requestPayload );

		// @FLOWFIXME
		const result : mixed = await response.json();

		// @FLOWFIXME Mixed-typehint issue.
		if ( result.token ) {
			// @FLOWFIXME Mixed-typehint issue.
			await this.setToken( result.token );

			return response;
		}

		return Promise.reject( new Error( 'Could not authenticate.' ) );
	}

	/**
	 *	Alias function for GET requests.
	 *
	 *	@param string uriPattern
	 *	@param ParserParamsType uriParams
	 *	@param JsonPropertyObjectType requestPayload
	 *
	 *	@return Promise
	 */
	async get( uriPattern : string, uriParams : ParserParamsType = {}, requestPayload : JsonPropertyObjectType = {} ) : Promise<mixed> {
		const targetUrl : string = this.resolveRequestUri( uriPattern, uriParams, 'GET' );
		return await this.request( targetUrl, 'GET', requestPayload );
	}

	/**
	 *	Alias function for POST requests.
	 *
	 *	@param string uriPattern
	 *	@param ParserParamsType uriParams
	 *	@param JsonPropertyObjectType requestPayload
	 *
	 *	@return Promise
	 */
	async post( uriPattern : string, uriParams : ParserParamsType = {}, requestPayload : JsonPropertyObjectType = {} ) : Promise<mixed> {
		const targetUrl : string = this.resolveRequestUri( uriPattern, uriParams, 'POST' );
		return await this.request( targetUrl, 'POST', requestPayload );
	}

	/**
	 *	Alias function for PUT requests.
	 *
	 *	@param string uriPattern
	 *	@param ParserParamsType uriParams
	 *	@param JsonPropertyObjectType requestPayload
	 *
	 *	@return Promise
	 */
	async put( uriPattern : string, uriParams : ParserParamsType = {}, requestPayload : JsonPropertyObjectType = {} ) : Promise<mixed> {
		const targetUrl : string = this.resolveRequestUri( uriPattern, uriParams, 'PUT' );
		return await this.request( targetUrl, 'PUT', requestPayload );
	}

	/**
	 *	Alias function for PATCH requests.
	 *
	 *	@param string uriPattern
	 *	@param ParserParamsType uriParams
	 *	@param JsonPropertyObjectType requestPayload
	 *
	 *	@return Promise
	 */
	async patch( uriPattern : string, uriParams : ParserParamsType = {}, requestPayload : JsonPropertyObjectType = {} ) : Promise<mixed> {
		const targetUrl : string = this.resolveRequestUri( uriPattern, uriParams, 'PATCH' );
		return await this.request( targetUrl, 'PATCH', requestPayload );
	}

	/**
	 *	Alias function for DELETE requests.
	 *
	 *	@param string uriPattern
	 *	@param ParserParamsType uriParams
	 *	@param JsonPropertyObjectType requestPayload
	 *
	 *	@return Promise
	 */
	async delete( uriPattern : string, uriParams : ParserParamsType = {}, requestPayload : JsonPropertyObjectType = {} ) : Promise<mixed> {
		const targetUrl : string = this.resolveRequestUri( uriPattern, uriParams, 'DELETE' );
		return await this.request( targetUrl, 'DELETE', requestPayload );
	}

}
