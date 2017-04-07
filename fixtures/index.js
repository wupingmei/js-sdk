/* @flow */

/**
 *	@type FixtureMap
 * Key, value map of request fixtures.
 */
type FixtureMap = { [ key : string ] : Object }

/**
 *	@type MockMap
 * Key, value map of request mock hanlers.
 */
type MockMap = { [ key : string ] : Function }

/**
 *	@const TEST_USERNAME string
 */
export const TEST_USERNAME : string = 'test@360player.com'

/**
 *	@const TEST_PASSWORD string
 */
export const TEST_PASSWORD : string = 'Sup3RzeKuR3_PwD!@pl4inTxT'

/**
 *	@const FixtureMap fixtures
 */
export const fixtures : FixtureMap = {
	"POST /v1/auth": {
		"token": "foo.bar.baz",
		"expire": new Date(Date.now() + 1000*60*60*24).toISOString()
	}
};

/**
 *	@const MockMap mocks
 */
export const mocks : MockMap = {
	"POST /v1/auth": ( payload ) => {
		let { username, password } = payload;
		return ( username === TEST_USERNAME && password === TEST_PASSWORD );
	}
}

export default fixtures;