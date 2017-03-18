/* @flow */

/* @dependencies */
import {API_ENDPOINT_URL} from './constants';


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

/**
 *	ThreeSixtyInterface
 *
 *	Handles interaction with public 360Player APIs. 
 */
export default class ThreeSixtyInterface {

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
		this[clientApiVersion] = apiVersion;
		this[clientApiKey] = apiKey;
		this[clientApiToken] = null;
		this.isConnected = false;
		this.isSandboxed = false;
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
		this[sandboxFixtures] = requestFixtures;
	}

	/**
	 *	@propertyGetter apiVersion
	 *
	 *	@return string
	 */
	get apiVersion() : string {
		return this[clientApiVersion];
	}
	
	/**
	 *	@propertyGetter clientToken
	 *
	 *	@return string|null
	 */
	get clientToken() : ?string {
		return this[clientApiToken];
	}

	/**
	 *	@async request
	 *
	 *	Attempts to make a new request to endpoint, if sandbox mode is active and fixtures are present, a resolved promise is returned.
	 *
	 *	@param string requestMethod
	 *	@param string endpointUrl
	 *	@param object|null payload
	 *	@param object|null additionalHeaders
	 *
	 *	@return Promise
	 */
	async request(requestMethod : string, endpointUrl : string, payload : ?Object, additionalHeaders : ?Object) : Promise<any> {
		let body = JSON.stringify(payload)
		let headers = Object.assign(ThreeSixtyInterface.defaultRequestHeaders, {
			'X-API-Key': this[clientApiKey]
		});
		
		if ( this.isSandboxed ) {
			let fixtureKey = `${requestMethod.toUpperCase()} /${this.apiVersion}/${endpointUrl}`;
			
			if (this[sandboxFixtures] === null) {
				throw Error("Sandbox mode requires fixtures to be set.");
			}
			
			if (this[sandboxFixtures].hasOwnProperty(fixtureKey) === false) {
				throw Error(`Fixture for request ${fixtureKey} not found.`);
			}
			
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
	 *	@return boolean
	 */
	async connect(username : string, password : string) : boolean {	
		let response = await this.request('post', 'auth', { username, password });
		let data = await response.json();
	
		if ( data && data.token ) {
			this.isConnected = true;
			this[clientApiToken] = data.token;
		} else {
			this.isConnected = false;
			this[clientApiToken] = null;
		}
	
		return this.isConnected;
	}

}
