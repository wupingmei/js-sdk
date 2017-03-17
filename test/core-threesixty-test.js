import ThreeSixty, { API_V1, API_ENDPOINT_URL } from '../src/threesixty'

/**
 *	@const string clientApiKey
 */
const clientApiKey = '360-js-sdk-api-v1-key';

describe('ThreeSixty', () => {

	let api;

	beforeAll(() => {
		api = new ThreeSixty(API_V1, clientApiKey);
	})

	it('correctly sets API version', () => {
		expect(api.version).toEqual(API_V1);
	});
	
	it('correctly sets API key', () => {
		expect(api.apiKey).toEqual(clientApiKey)
	});

	it('returns versioned API endpoint URL', () => {
		expect(api.endpointUrl).toEqual(`${API_ENDPOINT_URL}/${api.version}/`);
	});

});