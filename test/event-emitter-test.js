/* @dependencies */
import EventEmitter from '../src/event/emitter';


describe('EventEmitter', () => {

	let eventEmitter;

	const TEST_EVENT = 'jestTestEvent';
	const TEST_NOOP = () => null

	beforeEach(() => {
		eventEmitter = new EventEmitter();
		eventEmitter.emit = jest.fn();
	});

	it('registers listener', () => {
		const initListenerCount = eventEmitter.listenerCount(TEST_EVENT);
		eventEmitter.on(TEST_EVENT, TEST_NOOP);

		const listenerCount = eventEmitter.listenerCount(TEST_EVENT);

		expect(initListenerCount).toEqual(0);
		expect(listenerCount).toBeGreaterThan(initListenerCount);
	});

	it('unregisters listener', () => {
		eventEmitter.on(TEST_EVENT, TEST_NOOP);
		const initListenerCount = eventEmitter.listenerCount(TEST_EVENT);

		eventEmitter.off(TEST_EVENT, TEST_NOOP);
		const listenerCount = eventEmitter.listenerCount(TEST_EVENT);

		expect(initListenerCount).toEqual(1);
		expect(listenerCount).toBeLessThan(initListenerCount);
	});

	it('emits listener', () => {
		eventEmitter.on(TEST_EVENT, TEST_NOOP).emit(TEST_EVENT);

		expect(eventEmitter.emit).toBeCalledWith(TEST_EVENT);
	});

	it('emits once listener exactly once', async () => {
		// @NOTE Set up clean EventEmitter instance
		eventEmitter = new EventEmitter();

		let emitCallCount = 0;
		eventEmitter.once(TEST_EVENT, () => emitCallCount++);

		await Promise.all([
			eventEmitter.emit(TEST_EVENT),
			eventEmitter.emit(TEST_EVENT)
		]);

		expect(emitCallCount).toEqual(1);
	});

});
