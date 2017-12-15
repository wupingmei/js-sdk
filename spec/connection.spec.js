/* @dependencies */
import syncify from './syncify.helper';
import Connection, {
	sessionStoreTokenPolicy,
	sessionFetchTokenPolicy
} from '../src/connection';

describe('Connection versioning', () => {

	let connection;

	beforeAll(() => connection = new Connection());

	it('can set version', () => {
		const didSetApiVersion = connection.setApiVersion( 'v1' );
		expect( didSetApiVersion ).toBe( true );
	});

	it('cannot set invalid version', () => {
		const didSetApiVersion = connection.setApiVersion( 'v13.37' );
		expect( didSetApiVersion ).toBe( false );
	});

	it('can return current set version', () => {
		const didSetApiVersion = connection.setApiVersion( 'v1' );
		const currentApiVersion = connection.getApiVersion();

		expect( didSetApiVersion ).toBe( true );
		expect( currentApiVersion ).toBe( 'v1' )
	});

});

describe('Connection policies', () => {

	let connection;

	beforeAll(() => connection = new Connection());

	it('can set default policies', () => {
		const attemptedSetPolicies = () => connection.setTokenPolicies( sessionStoreTokenPolicy, sessionFetchTokenPolicy );
		expect( attemptedSetPolicies ).not.toThrowError();
	});

	it('throws error on missing policy', () => {
		const attemptedSetPolicies = () => connection.setTokenPolicies( sessionStoreTokenPolicy );
		expect( attemptedSetPolicies ).toThrowError();
	});

});

describe('Connection token', () => {

	let connection;

	beforeAll( () => {
		connection = new Connection();
		connection.setTokenPolicies(
			sessionStoreTokenPolicy,
			sessionFetchTokenPolicy
		);
	});

	it('can set a valid token', async () => {
		const didSetToken = await connection.setToken( 'valid-connection-token' );
		expect( didSetToken ).toBe( true );
	});

	it('throws on attempt to set invalid token', async () => {
		const attemptedSetToken = await syncify( async () => {
			 return await connection.setToken( /(this-is-not-a-valid-token)/ );
		});

		expect( attemptedSetToken ).toThrowError();
	});

	it('can get a valid token', async () => {
		const didSetToken = await connection.setToken( 'valid-connection-token' );
		const accessToken = await connection.getToken();

		expect( didSetToken ).toBe( true );
		expect( accessToken ).toEqual( 'valid-connection-token' );
	});

	it('throws error on attempt to get token when not set', async () => {
		const attemptedGetToken = await syncify( async () => {
			await connection.destroyToken();
			return await connection.getToken();
		});

		expect( attemptedGetToken ).toThrowError();
	});
});

describe('Connection headers', () => {

	let connection;

	beforeAll(() => connection = new Connection());

	it('can get headers', () => {
		const requestHeaders = connection.getRequestHeaders();
		expect( requestHeaders ).toBeDefined();
	});

	it('can set headers', () => {
		const didSetHeaders = connection.setRequestHeaders({
			'X-Custom-Header' : 'Hello World'
		});

		expect( didSetHeaders ).toBe( true );
	});

});

describe('Connection options', () => {

	let connection;

	beforeAll(() => connection = new Connection());

	it('can get options', () => {
		const requestOptions = connection.getRequestOptions();
		expect( requestOptions ).toBeDefined();
	});

	it('can get options', () => {
		const didSetOptions = connection.setRequestOptions({
			mode : 'cors'
		});

		expect( didSetOptions ).toBe( true );
	});

	it('can return options size', () => {
		const initialSize = connection.optionsSize;
		connection.setRequestOptions({
			method : 'DELETE'
		});

		const currentSize = connection.optionsSize;

		expect( currentSize ).toBeGreaterThan( initialSize );
	});

});

describe('Connection payload', () => {

	let connection;

	beforeAll(() => connection = new Connection());

	it('can set payload values', () => {
		const didSetPayload = connection.setPayload({
			favouriteBar: 'Mikkeller STHLM'
		});

		expect( didSetPayload ).toBe( true );
	});

	it('can unset payload values', () => {
		connection.setPayload({ foo : 'Foo' });
		const initialValue = connection.hasPayload( 'foo' );

		connection.setPayload( { foo : null }, true );
		const currentValue = connection.hasPayload( 'foo' );

		expect( initialValue ).toBe( true );
		expect( currentValue ).toBe( false );
	});

	it('can return payload size', () => {
		const initialSize = connection.payloadSize;
		connection.setPayload({ foo : 'Foo' });

		const currentSize = connection.payloadSize;

		expect( currentSize ).toBeGreaterThan( initialSize );
	});

	it('can destroy payload', () => {
		connection.setPayload({ foo : 'Foo' });
		const initialSize = connection.payloadSize;

		connection.destroyPayload();
		const currentSize = connection.payloadSize;

		expect( initialSize ).toBeGreaterThan( 0 );
		expect( currentSize ).toEqual( 0 );
	});

});
