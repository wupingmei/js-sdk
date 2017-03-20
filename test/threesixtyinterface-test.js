/* @dependencies */
import { API_V1 } from '../src/constants'
import ThreeSixtyInterface from '../src'
import { fixtures, mocks, TEST_API_KEY, TEST_USERNAME, TEST_PASSWORD } from '../fixtures'

describe('ThreeSixty', () => {

	let api;

	beforeEach(() => {
		api = new ThreeSixtyInterface(API_V1, TEST_API_KEY);
		api.sandboxed(fixtures, mocks);
		api.emit = jest.fn();
	})

	it('correctly sets API version', () => {
		expect(api.apiVersion).toEqual(API_V1);
	});
	
	it('connects with valid credentials', async () => {
		await api.connect(TEST_USERNAME, TEST_PASSWORD);
		expect(api.isConnected).toBe(true)
	});
	
	it('emits connected event with valid credentials', async () => {
		await api.connect(TEST_USERNAME, TEST_PASSWORD);
		expect(api.isConnected).toBe(true)
		expect(api.emit).toBeCalledWith('connect');
	});
	
	it('does not connect with invalid credentials', async () => {
		await api.connect(TEST_USERNAME, 'invalid_password');
		expect(api.isConnected).toBe(false)
	});
	
	it('emits disconnect event with invalid credentials', async () => {
		await api.connect(TEST_USERNAME, 'invalid_password');
		expect(api.isConnected).toBe(false)
		expect(api.emit).toBeCalledWith('disconnect');
	});

	it('connects without credentials using token instead', () => {
		api.useToken('foo.bar.baz');
		expect(api.isConnected).toBe(true)
		expect(api.emit).toBeCalledWith('connect');
	});

});