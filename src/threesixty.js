/* @flow */

/* @dependencies */
import { API_ENDPOINT_URL } from './constants'
import EventEmitter from './event/emitter'


/**
 *	@private symbol clientApiVersion
 */
let clientApiVersion = Symbol();

/**
 *	@private symbol clientApiKey
 */
let clientApiKey = Symbol();

/**
 *	@private symbol clientApiToken
 */
let clientApiToken = Symbol();

/**
 *	@private symbol sandboxFixtures
 */
let sandboxFixtures = Symbol();

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
	 *	Builds up initialization default values.
	 *
	 *	@param string apiVersion
	 *	@param string apiKey
	 *
	 *	@return void
	 */
	constructor(apiVersion : string, apiKey : string) : void {
		super();
		
		this.isConnected = false;
		this.isSandboxed = false;

		// @FLOWFIXME
		this[clientApiVersion] = apiVersion;
		
		// @FLOWFIXME
		this[clientApiKey] = apiKey;
		
		// @FLOWFIXME
		this[clientApiToken] = null;
	}

	/**
	 *	sandboxed
	 *
	 *	Sets sandboxed mode, regardless of previous mode.
	 *
	 *	@return void
	 */
	sandboxed() : void {
		this.isSandboxed = true;
		
		// @FLOWFIXME
		this[sandboxFixtures] = null;
	}

	/**
	 *	Sets fixtures used in sandbox mode. Is required if sandbox mode is active.
	 *
 	 *	@param object requestFixtures
	 *
	 *	@return void
	 */
	fixtures(requestFixtures : Object) : void {
		// @FLOWFIXME
		this[sandboxFixtures] = requestFixtures;
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
	async request(endpointUrl : string, requestMethod : string = "GET", payload : ?Object, additionalHeaders : ?RequestHeaders) : Promise<any> {
		let body = JSON.stringify(payload)
		let headers = Object.assign(ThreeSixtyInterface.defaultRequestHeaders, {
			// @FLOWFIXME
			'X-API-Key': this[clientApiKey]
		});
		
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
			
			return new Promise((resolve, reject) => {
				resolve({
					json: () => fixture,
					text: () => JSON.stringify(fixture)
				})
			});
		}
		
		return fetch(`${API_ENDPOINT_URL}/${this.apiVersion}/${endpointUrl}`, {
			body, headers, requestMethod: requestMethod.toUpperCase()
		});
	}

	/**
	 *	@async connect
	 *
	 *	Attempts to connect to authentication endpoint.
	 *
 	 *	@param string username
	 *	@param string password
	 *
	 *	@emits 'connect', 'connected', 'disconnected'
	 *
	 *	@return Promise
	 */
	async connect(username : string, password : string) : Promise<any> {
		this.emit('connect');
		
		let response = await this.request('auth', 'post', { username, password });
		let data = await response.json();
	
		if ( data && data.token ) {
			this.isConnected = true;
			this.emit('connected');
			
			// @FLOWFIXME
			this[clientApiToken] = data.token;
		} else {
			this.isConnected = false;
			this.emit('disconnected');
			
			// @FLOWFIXME
			this[clientApiToken] = null;
		}
	
		return response;
	}

}
