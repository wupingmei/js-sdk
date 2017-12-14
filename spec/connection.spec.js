/* @dependencies */
import syncify from '../syncify';
import connection, {
	sessionStoreTokenPolicy,
	sessionFetchTokenPolicy
} from '../src/connection';

describe('Connection versioning', () => {

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

	beforeAll( () => connection.setTokenPolicies( sessionStoreTokenPolicy, sessionFetchTokenPolicy ) );

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
