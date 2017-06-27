/* @flow */

/* @dependencies */
import { API_ENDPOINT_URL } from './constants'
import EventEmitter from './event/emitter'
import qs from 'query-string'
import 'whatwg-fetch'
import 'es6-symbol/implement'

/**
 *	@private symbol clientApiVersion
 */
let clientApiVersion = Symbol();

/**
 *	@private symbol clientApiToken
 */
let clientApiToken = Symbol();

/**
 *	@private symbol sandboxFixtures
 */
let sandboxFixtures = Symbol();

/**
 *	@private symbol sandboxMocks
 */
let sandboxMocks = Symbol();

/**
 *	@const array ENDPOINT_BEARER_WHITELIST
 */
const ENDPOINT_BEARER_WHITELIST = [
	[ 'POST', 'auth' ],
	[ 'POST', 'users' ]
];

/**
 *	@type RequestHeaders
 *	Key, value map of request headers.
 */
type RequestHeaders = { [ key : string ] : string }

/** @NOTE There's an open issue with computed properties and Flow - https://github.com/facebook/flow/issues/252 */

/**
 *	ThreeSixtyInterface
 *
 *	Handles interaction with public 360Player APIs.
 */
export default class ThreeSixtyInterface extends EventEmitter {

	/**
 	 *	@property boolean isConnected
	 */
	isConnected : boolean = false

	/**
 	 *	@property boolean isSandboxed
	 */
	isSandboxed : boolean = false

	/**
 	 *	@property boolean inDebugMode
	 */
	inDebugMode : boolean = false

	/**
 	 *	@property string apiEndpointUrl
	 */
	apiEndpointUrl : string

	/**
	 *	@static object defaultRequestHeaders
	 */
	static defaultRequestHeaders : RequestHeaders = {
		'Content-Type': 'application/json'
	}

	/**
	 *	@constructor
	 *
	 *	Sets required instance variables.
	 *
	 *	@param string apiVersion
	 *
	 *	@return void
	 */
	constructor( apiVersion : string ) : void {
		super();

		// @FLOWFIXME
		this[clientApiVersion] = apiVersion;

		// @FLOWFIXME
		this[clientApiToken] = null;

		this.apiEndpointUrl = API_ENDPOINT_URL;
	}

	/**
	 *	Sets sandboxed mode, regardless of previous mode.
	 *
	 *	@param object requestFixtures
	 *	@param object requestMocks
	 *
	 *	@return void
	 */
	sandboxed( requestFixtures : Object, requestMocks : Object ) : void {
		this.isSandboxed = true;

		// @FLOWFIXME
		this[sandboxFixtures] = requestFixtures;

		// @FLOWFIXME
		this[sandboxMocks] = requestMocks;

		this.log('info', 'Activated sandbox mode.');
	}

	/**
	 *	Sets debug mode which logs various things from class.
	 *
 	 *	@return void
	 */
	debugMode() : void {
		this.inDebugMode = true;
		this.log('info', 'Activated debug mode.');
	}

	/**
	 *	Logs message if {@see ThreeSixtyInterface#inDebugMode} is true.
	 *
	 *	@param string logType
	 *	@param any logSource
	 *	@param any, ... additionalParameters
	 */
	log( logType : "info" | "debug" | "warn" | "error", logSource : any, ...additionalParameters : Array<any> ) : void {
		if ( this.inDebugMode === true && console !== undefined ) {
			if ( additionalParameters.length > 0 ) {
				console[logType](logSource, ...additionalParameters);
			} else {
				console[logType](logSource);
			}
		}
	}

	/**
	 *	@propertyGetter apiVersion
	 *
	 *	@return string
	 */
	get apiVersion() : string {
		// @FLOWFIXME
		return this[clientApiVersion];
	}

	/**
	 *	@propertyGetter clientToken
	 *
	 *	@return string|null
	 */
	get clientToken() : ?string {
		// @FLOWFIXME
		return this[clientApiToken];
	}

	/**
	 *	@async request
	 *
	 *	Attempts to make a new request to endpoint, if sandbox mode is active and fixtures are present, a resolved promise is returned.
	 *
	 *	@param string endpointUri
	 *	@param string requestMethod
	 *	@param object|null payload
	 *	@param RequestHeaders|null additionalHeaders
	 *
	 *	@return Promise
	 */
	async request( endpointUri : string, requestMethod : MethodType = "GET", payload : Object = {}, additionalHeaders : RequestHeaders = {}, uriOptions : ?Object = {} ) : Promise<any> {
		let body = JSON.stringify(payload);
		let headers = Object.assign(additionalHeaders, ThreeSixtyInterface.defaultRequestHeaders);
		endpointUri = `${endpointUri.toLowerCase()}`.replace(/\/+/g, '/').replace(/\/+$/, '');

		// @NOTE Only pass Authorization header if applicable
		ENDPOINT_BEARER_WHITELIST.forEach(whitelist => {
			const [ method, uri ] = whitelist;
			const isWhitelisted = ( requestMethod === method && endpointUri === uri );

			// @FLOWFIXME
			if ( isWhitelisted === false && typeof this[clientApiToken] === 'string') {
				headers['Authorization'] = `Bearer ${this[clientApiToken]}`;
				return false;
			}
		});

		// @NOTE Append URI options to endpointUri
		if ( uriOptions && Object.keys(uriOptions).length > 0 ) {
			endpointUri += `?${qs.stringify(uriOptions)}`;
		}

		this.emit('request');

		// @NOTE Capture sandboxed mode
		if ( this.isSandboxed ) {
			let fixtureKey = `${requestMethod.toUpperCase()} /${this.apiVersion}/${endpointUri}`;

			// @FLOWFIXME
			if (this[sandboxFixtures] === null) {
				throw Error("Sandbox mode requires fixtures to be set.");
			}

			if (this[sandboxFixtures].hasOwnProperty(fixtureKey) === false) {
				throw Error(`Fixture for request ${fixtureKey} not found.`);
			}

			// @FLOWFIXME
			let fixture = this[sandboxFixtures][fixtureKey];

			// @FLOWFIXME
			if (this[sandboxMocks] === null) {
				throw Error("Sandbox mode requires mock functions to be set.");
			}

			if (this[sandboxMocks].hasOwnProperty(fixtureKey) === false) {
				throw Error(`Mock function for request ${fixtureKey} not found.`);
			}

			// @FLOWFIXME
			let mock = this[sandboxMocks][fixtureKey];

			this.log('debug', `Requesting mocked "${requestMethod} /${this.apiEndpointUrl}/${this.apiVersion}/${endpointUri}"`);

			return new Promise(( resolve, reject ) => {
				if (mock(payload) === true) {
					resolve({
						ok: true,
						json: () => fixture,
						text: () => JSON.stringify(fixture)
					})
				} else {
					let mockError = { error: "Mock function failed." };

					resolve({
						ok: false,
						json: () => mockError,
						text: () => JSON.stringify(mockError)
					})
				}
			});
		}

		const mode : ModeType = 'cors';
		const method : MethodType = requestMethod;
		let requestOptions : RequestOptions = { mode, body, headers, method };

		// @NOTE Body is not allowed for HEAD and GET requests
		if ( requestMethod === 'GET' || requestMethod === 'HEAD' ) {
			delete requestOptions.body
		}

		const returnedPromise = fetch(`${this.apiEndpointUrl}/${this.apiVersion}/${endpointUri}`, requestOptions);

		// @NOTE Do not expose body to log
		delete requestOptions.body;

		this.log('debug', `Requesting "${requestMethod} /${this.apiVersion}/${endpointUri}"`, requestOptions);

		return returnedPromise;
	}

	/**
	 *	@async connectWithPayload
	 *
	 *	Attempts to connect to authentication endpoint, sends payload.
	 *
 	 *	@param object payload
	 *	@param object uriOptions
	 *
	 *	@emits 'connect'
	 *
	 *	@return Promise
	 */
	async connectWithPayload( payload : Object, uriOptions : ?Object) : Promise<any> {
		let response = await this.request('auth', 'POST', payload, {}, uriOptions);
		let data = await response.json();

		if ( data !== undefined && data.token ) {
			this.isConnected = true;
			this.useToken(data.token);

			await this.emit('connect');
		} else {
			await this.disconnect();
		}

		return response;
	}

	/**
	 *	@async connect
	 *
	 *	Attempts to connect with user credentials.
	 *
 	 *	@param string username
	 *	@param string password
	 *
	 *	@emits 'connect'
	 *
	 *	@return Promise
	 */
	async connect( username : string, password : string ) : Promise<any> {
		return await this.connectWithPayload({ username, password });
	}

	/**
	 *	@async connect
	 *
	 *	Attempts to connect with Facebook access code.
	 *
 	 *	@param string authToken
	 *	@param string redirectUri
	 *
	 *	@emits 'connect'
	 *
	 *	@return Promise
	 */
	async connectWithFacebook( authToken : string, redirectUri : string ) : Promise<any> {
		return await this.connectWithPayload({
			code : authToken,
			redirect_uri : redirectUri
		}, { medium : 'facebook' });
	}

	/**
	 *	Sets default null values for connection status and removes authentication token.
	 *
	 *	@emits 'disconnect'
	 *
	 *	@return void
	 */
	disconnect() : void {
		// @FLOWFIXME
		this[clientApiToken] = null;

		this.isConnected = false;
		this.emit('disconnect');
		this.log('info', 'Disconnected');
	}

	/**
 	 *	Sets JWT token for current instance. If user is not connected, connection status is set to true and event emits.
	 *
	 *	@param string apiToken
	 *
	 *	@emits 'connect'
	 *
	 *	@return void
	 */
	useToken( apiToken : string ) : void {
		// @FLOWFIXME
		this[clientApiToken] = apiToken;

		if ( this.isConnected === false ) {
			this.isConnected = true;
			this.emit('connect');
			this.log('info', 'Connected');
		}
	}

	/**
	 *	Overrides API endpoint URL.
	 *
	 *	@param string newApiEndpointUrl
	 *
	 *	@return void
	 */
	useEndpoint( newApiEndpointUrl : string ) : void {
		this.log('info', `Changed endpoint from ${this.apiEndpointUrl} to ${newApiEndpointUrl}`);
		this.apiEndpointUrl = newApiEndpointUrl;
	}

}
