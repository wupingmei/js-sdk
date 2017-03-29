/* @dependencies */
import Cookie, { ObjectCookieJar } from '../src/cookie';

describe('Cookies', () => {

	let cookieStore;

	beforeAll(() => {
		// @NOTE This would be Cookie.use(document.cookie)
		cookieStore = new ObjectCookieJar();
		Cookie.use(cookieStore);
	});
	
	beforeEach(() => {
		Cookie.set('test', 'TestCookie');
	});

	it('has test cookie', () => {
		expect(Cookie.has('test')).toBe(true);
		expect(Cookie.get('test')).toEqual('TestCookie');
	});

	it('sets a new cookie', () => {
		Cookie.set('foo', 'Foo');
		expect(Cookie.has('test')).toBe(true);
	});

	it('removes test cookie', () => {
		Cookie.unset('test');
		expect(Cookie.has('test')).toBe(false);
	});

});