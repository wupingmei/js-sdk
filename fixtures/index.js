/* @flow */

/**
 *	@type FixtureMap
 * Key, value map of request fixtures.
 */
type FixtureMap = { [key : string] : Object }

/**
 *	@const FixtureMap fixtures
 */
const fixtures : FixtureMap = {
	"POST /v1/auth": {
		"token": "foo.bar.baz",
		"expire": new Date(Date.now() + 1000*60*60*24).toISOString()
	}
};

export default fixtures;