/* @dependencies */
import fixtures from '../fixtures'
import ThreeSixty from '../src/threesixty'
import { API_V1, API_ENDPOINT_URL } from '../src/constants'

/**
 *	@const string clientApiKey
 */
const clientApiKey = '360JSSDK-T3ST-SNDBX-MODE';

describe('ThreeSixty', () => {

	let api;

	beforeAll(() => {
		api = new ThreeSixty(API_V1, clientApiKey);
		api.sandboxed();
		api.fixtures(fixtures);
	})

	it('correctly sets API version', () => {
		expect(api.apiVersion).toEqual(API_V1);
	});
	
	it('connects with valid credentials', async () => {
		await api.connect('test@360player.com', 'Sup3RzeKuR3_PwD!@pl4inTxT');
		expect(api.isConnected).toBe(true)
	});

});