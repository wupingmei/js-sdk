/**
 *	Jest helper for async/await specs.
 *
 *	@NOTE
 *		Jest has inconsistencies in working with async/await.
 *		Therefore we need this helper to be able to expect promises to throw error.
 *		I.e. `expect( resultFromAsyncAwait ).toThrowError()`
 *
 *	@param function callback
 *
 *	@return function
 */
export default async function syncify( callback : Function ) : Function {
	try {
		const result = await callback();
		return () => result;
	} catch ( error ) {
		return () => {
			throw error;
		};
	}
}
