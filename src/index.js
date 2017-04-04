/* @flow */

/* @dependencies */
import { API_ENDPOINT_URL } from './constants'
import EventEmitter from './event/emitter'
import 'whatwg-fetch'


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
 *	@type RequestHeaders
 *	Key, value map of request headers.
 */
type RequestHeaders = { [key : string] : string }

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
	isConnected : boolean
	
	/**
 	 *	@property boolean isSandboxed
	 */
	isSandboxed : boolean

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
	constructor(apiVersion : string) : void {
		super();
		
		this.isConnected = false;
		this.isSandboxed = false;

		// @FLOWFIXME
		this[clientApiVersion] = apiVersion;
		
		// @FLOWFIXME
		this[clientApiToken] = null;
	}

	/**
	 *	sandboxed
	 *
	 *	Sets sandboxed mode, regardless of previous mode.
	 *
	 *	@param object requestFixtures
	 *	@param object requestMocks
	 *
	 *	@return void
	 */
	sandboxed(requestFixtures : Object, requestMocks : Object) : void {
		this.isSandboxed = true;
		
		// @FLOWFIXME
		this[sandboxFixtures] = requestFixtures;
		
		// @FLOWFIXME
		this[sandboxMocks] = requestMocks;
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
	 *	@param string endpointUrl
	 *	@param string requestMethod
	 *	@param object|null payload
	 *	@param RequestHeaders|null additionalHeaders
	 *
	 *	@return Promise
	 */
	async request(endpointUrl : string, requestMethod : string = "GET", payload : Object = {}, additionalHeaders : RequestHeaders = {}) : Promise<any> {
		let body = JSON.stringify(payload);
		requestMethod = requestMethod.toUpperCase();
		let headers = Object.assign(additionalHeaders, ThreeSixtyInterface.defaultRequestHeaders);
		
		requestMethod = requestMethod.toUpperCase();
		endpointUrl = `${endpointUrl.toLowerCase()}`.replace(/\/+/g, '/').replace(/\/+$/, '');
		
		// @NOTE Only pass Authorization header if applicable
		if ( requestMethod === 'POST' && ( endpointUrl === 'auth' || endpointUrl === 'users' ) === false ) {
			// @FLOWFIXME
			headers['Authorization'] = `Bearer ${this[clientApiToken]}`;
		}
		
		this.emit('request');
		
		if ( this.isSandboxed ) {
			let fixtureKey = `${requestMethod.toUpperCase()} /${this.apiVersion}/${endpointUrl}`;
			
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
		
		let requestOptions = { body, headers, requestMethod };
		
		// @NOTE Body is not allowed for HEAD and GET requests
		if ( requestMethod === 'GET' || requestMethod === 'HEAD' ) {
			delete requestOptions.body
		}
		
		return fetch(`${API_ENDPOINT_URL}/${this.apiVersion}/${endpointUrl}`, requestOptions);
	}

	/**
	 *	@async connect
	 *
	 *	Attempts to connect to authentication endpoint.
	 *
 	 *	@param string username
	 *	@param string password
	 *
	 *	@emits 'connect'
	 *
	 *	@return Promise
	 */
	async connect(username : string, password : string) : Promise<any> {		
		let response = await this.request('auth', 'post', { username, password });
		let data = await response.json();
	
		if ( response.ok && data && data.token ) {
			this.isConnected = true;
			this.useToken(data.token);
			
			await this.emit('connect');
		} else {
			await this.disconnect();
		}
	
		return response;
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
	useToken(apiToken : string) : void {
		// @FLOWFIXME
		this[clientApiToken] = apiToken;
		
		if ( this.isConnected === false ) {
			this.isConnected = true;
			this.emit('connect');
		}
	}

}
