/* @flow */

/* @dependencies */
import 'weakmap-polyfill';


/**
 *	@type CookieObject
 */
type CookieObject = { [ key : string ] : string }

/**
 *	@private
 *	Attempts to encode unencoded string using encodeURIComponent.
 *
 *	@param any unencodedString
 *
 *	@return string
 */
function encode(unencodedString : any) : string {
	try {
		return encodeURIComponent(unencodedString);
	} catch ( error ) {
		return unencodedString;
	}
}

/**
 *	@private
 *	Attempts to decode encoded string using decodeURIComponent.
 *
 *	@param any encodedString
 *
 *	@return string
 */
function decode(encodedString : any) : string {
	try {
		return decodeURIComponent(encodedString);
	} catch ( error ) {
		return encodedString;
	}
}

/**
 *	Dummy cookie jar.
 */
export class ObjectCookieJar {

	jar : CookieObject = {}

	set cookie(cookieHeader : string) : void {
		let actualCookieData = cookieHeader.split(/;(.+)/)[0];
		let [ name, value ] = actualCookieData.split(/=(.+)/);
		
		name = name.replace('=', '').trim();
		this.jar[name] = value;
		
		// @NOTE Remove if value is empty
		if ( value === undefined ) {
			delete this.jar[name];
		}
	}
	
	get cookie() : string {
		let cookieParts = [];
		
		for ( let [ key, value ] of Object.entries(this.jar) ) {
			cookieParts.push(`${encode(key)}=${encode(value)}`);
		}
		
		return cookieParts.join(';');
	}

}

/**
 *	Client cookie jar.
 */
export class ClientCookieJar {

	set cookie(cookieHeader : string) : void {
		document.cookie = cookieHeader
	}
	
	get cookie() : string {
		return document.cookie;
	}

}

/**
 *	@private
 *	@const WeakMap cookieJar
 *	@NOTE Cast WeakMap reference as Function since the Cookie class is static.
 */
const cookieJar : WeakMap<Function, any> = new WeakMap();

/**
 *	Cookie helper class.
 */
export default class Cookie {

	/**
	 *	Sets new cookie jar, may be something like {@see CookieJar}-instance or document.cookie.
	 *
	 *	@oaram any newCookieJar
	 *
	 *	@return void
	 */
	static use(newCookieJar : any) : void {
		cookieJar.set(Cookie, newCookieJar);
	}

	/**
	 *	Parses a cookie string and casts it as an object.
	 *
	 *	@param string cookieString
	 *
	 *	@return CookieObject
	 */
	static parse(cookieString : string) : CookieObject {
		let cookieObject : CookieObject = {};
		
		if ( cookieString === undefined ) {
			return cookieObject;
		}
		
		cookieString.replace(/([^\s,=]+)=([^,]+)(?=,|$)/g, (match, key, value) => {
			cookieObject[key] = decode(value);
			return value;
		});
		
		return cookieObject;
	}

	/**
	 *	Stringifies an object into cookie string.
	 *
	 *	@param CookieObject cookieObject
	 *
	 *	@return string
	 */
	static stringify(cookieObject : CookieObject) : string {
		let { name, value } = cookieObject;
		
		delete cookieObject.name;
		delete cookieObject.value;
		
		let cookieParts = [ `${encode(name)}=${encode(value)}` ];
		
		for ( let [ key, value ] of Object.entries(cookieObject) ) {
			cookieParts.push(`${encode(key)}=${encode(value)}`);
		}
		
		return cookieParts.join(';');
	}

	/**
	 *	Sets a cookie.
	 *
	 *	@param string cookieIdentifier
	 *	@param string cookieValue
	 *	@param number cookieExpireDays
	 *	@param object additionalCookieOptions
	 *
	 *	@return void
	 */
	static set(cookieIdentifier : string, cookieValue : string, cookieExpireDays : number = 7, additionalCookieOptions : Object = {}) : void {
		const jar : any = cookieJar.get(Cookie);
		let expireDate = new Date(Date.now() + (cookieExpireDays * 24 * 60 * 60 * 1000)).toUTCString();
		
		if ( cookieExpireDays <= 0 ) {
			expireDate = (new Date(0)).toUTCString();
		}
		
		const cookieString = Cookie.stringify(Object.assign({
			name: cookieIdentifier,
			value: encode(cookieValue),
			expire: expireDate
		}, additionalCookieOptions));
		
		jar.cookie = cookieString;
	}
	
	/**
	 *	Attempts to retrieve cookie value based on name.
	 *
	 *	@param string cookieIdentifier
	 *
	 *	@return string|undefined
	 */
	static get(cookieIdentifier : string) : mixed {
		const jar : any = cookieJar.get(Cookie);
		const parsedCookie = Cookie.parse(jar.cookie);
		return parsedCookie[cookieIdentifier];
	}
	
	/**
	 *	Validates whether or not cookie exists or not.
	 *
	 *	@param string cookieIdentifier
	 *
	 *	@return bool
	 */
	static has(cookieIdentifier : string) : bool {
		return Cookie.get(cookieIdentifier) !== undefined;
	}
	
	/**
	 *	Removes cookie form jar.
	 *
	 *	@param string cookieIdentifier
	 *
	 *	@return void
	 */
	static unset(cookieIdentifier : string) : void {
		Cookie.set(cookieIdentifier, "", 0);
	}
	
	/**
	 *	Validates that cookie value matches expected value.
	 *
	 *	@param string cookieIdentifier
	 *	@param string cookieValue
	 *
	 *	@return bool
	 */
	static matches(cookieIdentifier : string, expectedCookieValue : string) : bool {
		return ( Cookie.has(cookieIdentifier) === true && Cookie.get(cookieIdentifier) === expectedCookieValue );
	}

}