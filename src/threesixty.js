/* @flow */

/**
 *	@const string API_V1
 */
export const API_V1 = 'v1';

/**
 *	@const array API_AVAILABLE_VERSIONS
 */
const API_AVAILABLE_VERSIONS = [ API_V1 ];

/**
 *	@const string API_DEFAULT_VERSION
 */
const API_DEFAULT_VERSION = API_V1;

/**
 *	@const string API_ENDPOINT_URL
 */
export const API_ENDPOINT_URL = 'https://api.360player.com'

/**
 *	@private symbol apiVersion
 */
let apiVersion = Symbol();

/**
 *	@private symbol apiKey
 */
let apiKey = Symbol();

/**
 *	Core class, handles initialization of API interaction.
 *
 *	@property string version
 */
export default class ThreeSixty {
	
	/**
	 *	Sets API version and API key.
	 *
	 *	@param string apiVersion
	 *	@param string clientApiKey
	 *
	 *	@return void
	 */
	constructor(clientApiVersion : string, clientApiKey : string) : void {
		if (API_AVAILABLE_VERSIONS.includes(clientApiVersion) === true) {
			this[apiVersion] = clientApiVersion;
		} else {
			this[apiVersion] = API_DEFAULT_VERSION
		}
		
		this[apiKey] = clientApiKey;
	}
	
	/**
	 *	Returns current version.
	 *	@propertyGetter version
	 *
	 *	@return string
	 */
	get version() : string {
		return this[apiVersion];
	}

	/**
	 *	Returns instance API key.
	 *	@propertyGetter apiKey
	 *
	 *	@return string 
	 */
	get apiKey() : string {
		return this[apiKey]
	}

	/**
	 *	Returns resolved endpoint URL.
	 *
	 *	@return string
	 */
	get endpointUrl() : string {
		return `${API_ENDPOINT_URL}/${this.version}/`;
	}

}
